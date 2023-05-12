import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { initializePayment } from "../api/paystackApi";
import { PaymentTransaction } from "../model/paystack";
import { BadRequestError } from "../utils/ApiError";

export const CreatePayment = async (req: Request, res: Response) => {
  const { amount, email, callbackUrl, name } = req.body;

  const paymentDetails = {
    amount,
    email,
    callback_url: callbackUrl,
    metadata: {
      amount,
      email,
      name,
    },
  };

  const data: any = await initializePayment(paymentDetails);

  return res.status(StatusCodes.OK).send({
    message: "Payment initialized successfully",
    data,
  });
};

export const CreateverifyPayment = async (req: Request, res: Response) => {
  const reference = req.query.reference;

  if (!reference) {
    throw new BadRequestError("Missing transaction reference");
  }

  const {
    data: {
      metadata: { email, amount, name },
      reference: paymentReference,
      status: transactionStatus,
    },
  } = await verifyPayment(reference);

  if (transactionStatus !== "success") {
    throw new BadRequestError(`Transaction: ${transactionStatus}`);
  }

  const [donation] = await PaymentTransaction.findOrCreate({
    where: { paymentReference },
    defaults: { amount, email, name, paymentReference },
  });

  return res.status(StatusCodes.OK).send({
    message: "Payment verified",
    data: donation,
  });
};

function verifyPayment(
  reference: string | import("qs").ParsedQs | string[] | import("qs").ParsedQs[]
):
  | {
      data: {
        metadata: { email: any; amount: any; name: any };
        reference: any;
        status: any;
      };
    }
  | PromiseLike<{
      data: {
        metadata: { email: any; amount: any; name: any };
        reference: any;
        status: any;
      };
    }> {
  throw new Error("Function not implemented.");
}
