declare module "https://deno.land/std@0.168.0/http/server.ts" {
  export function serve(handler: (req: Request) => Response | Promise<Response>): void;
}

declare module "https://esm.sh/stripe@13.6.0?target=deno" {
  export default class Stripe {
    constructor(apiKey: string, options?: any);
    checkout: {
      sessions: {
        create(params: any): Promise<any>;
      };
    };
  }
} 