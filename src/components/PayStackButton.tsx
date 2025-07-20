import { PaystackButton } from "react-paystack";
import { useState } from "react";

interface PayStackButtonProps {
  amount: number;
  email: string;
  onSuccess?: (reference: any) => void;
  onClose?: () => void;
  buttonText?: string;
  className?: string;
}

const PayStackButton = ({
  amount,
  email,
  onSuccess,
  onClose,
  buttonText = "Pay Now",
  className = "",
}: PayStackButtonProps) => {
  const [reference] = useState(new Date().getTime().toString());
  const config = {
    reference,
    email,
    amount: amount * 100, // Convert to kobo (or cents)
    publicKey:
      // process.env.REACT_APP_PAYSTACK_PUBLIC_KEY ||
      "pk_test_5465d31db5d4b95eeba10842bf3584ceb2215a09",
  };

  // Success handler
  const handlePaystackSuccessAction = (reference: any) => {
    console.log("Payment successful!", reference);

    // Call the parent component's onSuccess if provided
    if (onSuccess) {
      onSuccess(reference);
    }

    // Additional actions like API calls could go here
  };

  // Close handler
  const handlePaystackCloseAction = () => {
    console.log("Payment dialog closed");
    // Call the parent component's onClose if provided
    if (onClose) {
      onClose();
    }
  };

  const componentProps = {
    ...config,
    text: buttonText,
    onSuccess: (reference: any) => handlePaystackSuccessAction(reference),
    onClose: handlePaystackCloseAction,
  };
  return <PaystackButton className={className} {...componentProps} />;
};

export default PayStackButton;
