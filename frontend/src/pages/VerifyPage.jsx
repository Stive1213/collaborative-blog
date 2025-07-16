import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function VerifyPage() {
  const { token } = useParams();
  const [message, setMessage] = useState("Verifying...");
  const [error, setError] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/auth/verify/${token}`);
        setMessage(res.data.message);
      } catch (err) {
        setError(err.response?.data?.message || "Verification failed");
      }
    };
    verifyEmail();
  }, [token]);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow text-center">
      <h2 className="text-xl font-bold mb-4">Email Verification</h2>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <p className="text-green-600">{message}</p>
      )}
    </div>
  );
}

export default VerifyPage;
