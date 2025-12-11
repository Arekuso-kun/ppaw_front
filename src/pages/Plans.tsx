import { useEffect, useState } from "react";
import { Card, Typography, Button, CircularProgress, Alert, Chip } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

interface Plan {
  planid: number;
  planname: string;
  maxconversionsperday: number;
  maxfilesize: number;
  price: number;
}

interface User {
  userid: number;
  planid: number;
  name: string;
  email: string;
}

const API_BASE_URL = import.meta.env.API_URL || "http://localhost:3000/api/v1";

const Plans = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userPlanId, setUserPlanId] = useState<number | null>(null);
  const [updatingPlanId, setUpdatingPlanId] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/plans`);
        if (!response.ok) {
          throw new Error("Nu s-au putut încărca planurile.");
        }
        const data = await response.json();
        setPlans(data);

        const userString = localStorage.getItem("user");
        if (userString) {
          const user = JSON.parse(userString);
          if (user && user.planid) {
            setUserPlanId(user.planid);
          }
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("A connection error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSelectPlan = async (planid: number) => {
    if (userPlanId === planid) return;
    setError(null);
    setSuccessMessage(null);
    setUpdatingPlanId(planid);

    try {
      const userString = localStorage.getItem("user");
      let userObj: User | null = null;
      if (userString) {
        userObj = JSON.parse(userString);
      }

      if (!userObj || typeof userObj.userid !== "number") {
        throw new Error("Utilizatorul nu este autentificat.");
      }

      const response = await fetch(`${API_BASE_URL}/users/${userObj.userid}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ planid }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Eroare la actualizarea planului.");
      }

      // Update localStorage user object if present
      if (userObj) {
        userObj.planid = planid;
        localStorage.setItem("user", JSON.stringify(userObj));
      }

      setUserPlanId(planid);
      setSuccessMessage("Planul a fost actualizat cu succes.");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("A connection error occurred.");
      }
    } finally {
      setUpdatingPlanId(null);
    }
  };

  const getPlanStyles = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName === "standard") {
      return {
        borderColor: "border-indigo-600",
        textColor: "text-indigo-700",
      };
    } else if (lowerName === "premium") {
      return {
        borderColor: "border-purple-500",
        textColor: "text-purple-700",
        buttonColor: "secondary" as const,
      };
    } else {
      return {
        borderColor: "border-gray-400",
        textColor: "text-gray-700",
      };
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-10">
        <Alert severity="error">Eroare: {error}</Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <Typography variant="h3" className="font-bold text-gray-800">
          Alege un Plan
        </Typography>
        <Typography variant="subtitle1" className="text-gray-500 mt-2">
          Crește-ți limitele de conversie
        </Typography>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => {
          const styles = getPlanStyles(plan.planname);
          const isCurrentPlan = userPlanId === plan.planid;

          return (
            <Card
              key={plan.planid}
              className={`
                shadow-lg  p-6 flex flex-col items-center 
                ${isCurrentPlan ? "ring-2 ring-green-500 bg-gray-50" : "bg-white"}
              `}
            >
              {isCurrentPlan && <Chip label="Activ" color="success" size="small" className="mb-2" />}

              <Typography variant="h5" className={`font-bold ${styles.textColor}`}>
                {plan.planname}
              </Typography>

              <Typography variant="h4" className="mt-2 mb-8">
                {plan.price} RON / luna
              </Typography>

              <ul className="space-y-3 mb-8 text-gray-600 text-sm w-full">
                <li className="flex items-center">
                  <CheckCircleIcon className="text-green-500 mr-2 text-sm" />
                  {plan.maxconversionsperday} conversii / zi
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="text-green-500 mr-2 text-sm" />
                  Imagini pana la {plan.maxfilesize} MB
                </li>
              </ul>

              <Button
                variant={isCurrentPlan ? "outlined" : "contained"}
                color="primary"
                fullWidth
                disabled={isCurrentPlan || (updatingPlanId !== null && updatingPlanId !== plan.planid)}
                onClick={() => handleSelectPlan(plan.planid)}
                className={`mt-auto ${isCurrentPlan ? "opacity-70 cursor-not-allowed" : ""}`}
              >
                {isCurrentPlan ? "Plan Curent" : "Alege"}
              </Button>
            </Card>
          );
        })}
      </div>

      {successMessage && (
        <div className="max-w-6xl mx-auto mt-6">
          <Alert severity="success">{successMessage}</Alert>
        </div>
      )}
    </div>
  );
};

export default Plans;
