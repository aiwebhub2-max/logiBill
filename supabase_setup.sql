-- 1. Create a link between companies and authenticated users
ALTER TABLE public.companies
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- 2. Enable Row Level Security (RLS) on all tables
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policies

-- Policy for Companies: A user can only see and update their own company
CREATE POLICY "Users can manage their own company"
ON public.companies
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Helper function to check if the current user owns a company_id
CREATE OR REPLACE FUNCTION public.user_owns_company(company_id_param UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.companies 
    WHERE id = company_id_param AND user_id = auth.uid()
  );
$$;

-- Policy for Clients
CREATE POLICY "Users can manage their company's clients"
ON public.clients
FOR ALL
TO authenticated
USING (public.user_owns_company(company_id))
WITH CHECK (public.user_owns_company(company_id));

-- Policy for Inventory Items
CREATE POLICY "Users can manage their company's inventory"
ON public.inventory_items
FOR ALL
TO authenticated
USING (public.user_owns_company(company_id))
WITH CHECK (public.user_owns_company(company_id));

-- Policy for Invoices
CREATE POLICY "Users can manage their company's invoices"
ON public.invoices
FOR ALL
TO authenticated
USING (public.user_owns_company(company_id))
WITH CHECK (public.user_owns_company(company_id));

-- Policy for Payments
CREATE POLICY "Users can manage their company's payments"
ON public.payments
FOR ALL
TO authenticated
USING (public.user_owns_company(company_id))
WITH CHECK (public.user_owns_company(company_id));

-- Policy for Invoice Lines
-- (Since invoice_lines might not have a company_id, we check the related invoice's company_id)
-- If your invoice_lines table has a company_id, you can use the same policy as above.
-- Assuming invoice_lines links to invoice_id:
CREATE POLICY "Users can manage lines of their company's invoices"
ON public.invoice_lines
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.invoices
    WHERE invoices.id = invoice_lines.invoice_id
    AND public.user_owns_company(invoices.company_id)
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.invoices
    WHERE invoices.id = invoice_lines.invoice_id
    AND public.user_owns_company(invoices.company_id)
  )
);

-- 4. Automatically create a company when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.companies (user_id, name, address, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'company_name', 'Mon Entreprise'),
    '',
    NEW.email
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
