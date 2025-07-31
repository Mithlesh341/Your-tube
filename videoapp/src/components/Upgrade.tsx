
import axiosInstance from "@/lib/axiosinstance";
import { useUser } from "@/lib/AuthContext";
import { X } from "lucide-react";

const loadRazorpayScript = () =>
  new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });


const plans = [
  { name: "Bronze", time: 7, cost: 10 },
  { name: "Silver", time: 10, cost: 50 },
  { name: "Gold", time: "Unlimited", cost: 100 },
];

interface SubscribePlansProps {
  onClose: () => void;
}

const Upgrade = ({ onClose }: SubscribePlansProps) => {
  const { user } = useUser();
  //

  const handleUpgrade = async (planName: string) => {
  const res = await loadRazorpayScript();
  if (!res) {
    alert("Failed to load Razorpay SDK. Check your connection.");
    return;
  }

  try {
    // 1. Create order from backend
    const orderRes = await axiosInstance.post("/subscription/create-order", {
      plan: planName,
    });

    const { amount, id: order_id, currency } = orderRes.data;

    // 2. Configure Razorpay options
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, 
      amount,
      currency,
      name: "YouTube Clone",
      description: `Upgrade to ${planName}`,
      order_id,
      handler: async function (response: any) {
        // 3. On successful payment, verify it and update user
        const verifyRes = await axiosInstance.post(
          "/subscription/verify-payment",
          {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
            plan: planName,
            userId: user?._id,
          }
        );

        if (verifyRes.data.success) {
          //alert("Payment successful! Plan upgraded.");
          onClose();
          window.location.reload(); // or update state
        } else {
          alert("Payment verification failed.");
        }
      },
      prefill: {
        name: user?.name,
        email: user?.email,
      },
      theme: {
        color: "#0ea5e9",
      },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  } catch (error) {
    console.error("Error during payment:", error);
    alert("Something went wrong during the payment process.");
  }
};


  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 px-4 sm:px-6">
      <div className="bg-white rounded-2xl p-4 sm:p-6 w-full max-w-3xl relative shadow-lg max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black cursor-pointer"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-6">
          Choose Your Plan
        </h2>
        <p className="text-center text-sm sm:text-base text-red-600 mb-2">
          (If You have crossed your current plan's limit, you can choose to upgrade your plan to a new
          plan)
        </p>
                <p className="text-center text-xs sm:text-sm text-gray-500 mb-6">Time limit of plans might change in future</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {plans.map((plan) => {
            const isCurrent = plan.name === user?.plan;
            return (
              <div
                key={plan.name}
              className={`p-4 sm:p-5 border rounded-xl shadow transition-all ${
                isCurrent
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-200 hover:shadow-lg"
              }`}
              >
                <h3 className="text-lg sm:text-xl font-semibold text-center mb-2">
                  {plan.name}
                </h3>
                <p className="text-center text-gray-600 text-sm sm:text-base">
                  Watch Time:{" "}
                  <span className="font-medium">{plan.time} minutes</span>
                </p>
                <p className="text-center text-gray-600 text-sm sm:text-base mb-4">
                  Price: ₹{plan.cost}
                </p>
                <button
                  onClick={() => handleUpgrade(plan.name)}
                className={`block mx-auto px-4 py-2 cursor-pointer rounded-full font-semibold text-sm sm:text-base transition ${
                  isCurrent
                    ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
                  disabled={isCurrent}
                >
                  {isCurrent ? "Current Plan" : "Upgrade"}
                </button>

              </div>
              
            );
          })}
   
        </div>
      </div>
    </div>
  );
};

export default Upgrade;


