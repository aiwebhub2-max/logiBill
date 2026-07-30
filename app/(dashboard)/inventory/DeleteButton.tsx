"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { deleteInventoryItem } from "@/app/actions/inventory";
import ConfirmModal from "@/components/ui/ConfirmModal";

export default function DeleteButton({ id }: { id: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteInventoryItem(id);
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(false);
      setIsOpen(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        title="Supprimer"
      >
        <Trash2 className="w-4 h-4" />
      </button>

      <ConfirmModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleDelete}
        title="Supprimer l'article"
        description="Êtes-vous sûr de vouloir supprimer cet article de l'inventaire ? Cette action est irréversible."
        confirmText="Supprimer"
        isLoading={isDeleting}
      />
    </>
  );
}
