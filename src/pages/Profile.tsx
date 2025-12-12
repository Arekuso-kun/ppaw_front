import React, { useEffect, useState } from "react";
import { Card, Typography, Chip, CircularProgress, Alert } from "@mui/material";
import { apiRequest } from "../utils/api";

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
  plans: Plan;
}

interface ConversionInfo {
  remainingConversions: number;
  dailyUsage: number;
  maxConversions: number;
  maxFileSize: number;
}

const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [convInfo, setConvInfo] = useState<ConversionInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getPlanColors = (name: string) => {
    switch (name.toLowerCase()) {
      case "standard":
        return { bg: "bg-indigo-100", text: "text-indigo-800" };
      case "premium":
        return { bg: "bg-purple-100", text: "text-purple-800" };
      default:
        return { bg: "bg-gray-100", text: "text-gray-800" };
    }
  };

  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (!userString) {
      setLoading(false);
      return;
    }
    const userObj = JSON.parse(userString);

    const fetchData = async () => {
      try {
        const userData = await apiRequest<User>(`/users/${userObj.userid}`);
        setUser(userData);
        const convData = await apiRequest<ConversionInfo>(`/users/${userObj.userid}/conversions`);
        setConvInfo(convData);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "A apărut o eroare neașteptată.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <CircularProgress />
      </div>
    );

  if (error)
    return (
      <div className="container mx-auto px-4 py-10">
        <Alert severity="error">Eroare: {error}</Alert>
      </div>
    );

  if (!user || !convInfo)
    return <div className="text-center mt-10">Nu s-a găsit utilizatorul sau datele de conversie.</div>;

  const planColors = getPlanColors(user.plans.planname);

  return (
    <div className="container mx-auto px-4 py-10 max-w-xl">
      <Card className="shadow-lg overflow-visible p-6">
        <div className="flex items-center mb-6">
          <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center text-3xl font-bold text-gray-600 mr-4">
            {user?.name ? user.name.charAt(0).toUpperCase() : "?"}
          </div>
          <div>
            <Typography variant="h5" className="font-bold">
              {user.name}
            </Typography>
            <Typography variant="body2" className="text-gray-500">
              {user.email}
            </Typography>
            <Chip
              label={"Plan " + user.plans.planname}
              size="small"
              className={`mt-2 font-bold ${planColors.bg} ${planColors.text}`}
            />
          </div>
        </div>

        <div className="border-t pt-4">
          <Typography variant="subtitle2" className="text-gray-500 mb-3 uppercase text-xs font-bold">
            Detalii Cont
          </Typography>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-400">Conversii efectuate azi</p>
              <p className="font-medium">{convInfo.dailyUsage}</p>
            </div>
            <div>
              <p className="text-gray-400">Dimensiune maximă imagine</p>
              <p className="font-medium">{convInfo.maxFileSize} MB</p>
            </div>
            <div>
              <p className="text-gray-400">Conversii rămase azi</p>
              <p className="font-medium">{convInfo.remainingConversions}</p>
            </div>
            <div>
              <p className="text-gray-400">Limită conversii / zi</p>
              <p className="font-medium">{convInfo.maxConversions}</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Profile;
