# Règles pour les agents

## Vérification des liens locaux
Avant d'envoyer un lien localhost à l'utilisateur, vérifiez toujours qu'il est fonctionnel (par exemple en faisant une requête HTTP avec read_url_content ou le browser_subagent). N'envoyez que des liens préalablement testés et confirmés comme fonctionnels. Ne supposez jamais qu'une page fonctionne sans l'avoir vérifiée.
