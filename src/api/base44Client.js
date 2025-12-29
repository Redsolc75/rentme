import { createClient } from '@base44/sdk';

// Create a client with specific domain configuration
export const base44 = createClient({
  appId: "695172a8e74f1397aadca539", 
  requiresAuth: false, // Ho posem false per evitar el bloqueig inicial
  domain: "gestio-immobiliaria-pro-aadca539.base44.app" // AQUESTA ÉS LA CLAU: Forcem el domini bo
});
