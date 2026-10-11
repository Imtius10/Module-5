import { Request, Response } from "express";
declare const stripeWebhook: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const paymentWebhookController: {
    stripeWebhook: typeof stripeWebhook;
};
export {};
//# sourceMappingURL=payment.webhook.Controller.d.ts.map