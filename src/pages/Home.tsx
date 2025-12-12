import React from "react";
import { Card, CardContent, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-10 max-w-2xl">
      <Card className="shadow-lg">
        <CardContent className="p-8 text-center">
          <Typography variant="h4" className="mb-6 font-bold text-gray-700">
            Convertor Imagini
          </Typography>
          <Typography variant="body1" className="text-gray-600 mb-6">
            Transformă imaginile rapid între diferite formate.
          </Typography>

          <Box className="flex flex-col sm:flex-row justify-center gap-4">
            <Button variant="contained" size="large" color="primary" onClick={() => navigate("/convert")}>
              Începe Conversia
            </Button>
            <Button variant="outlined" size="large" color="primary" onClick={() => navigate("/plans")}>
              Vezi Planurile
            </Button>
            <Button variant="outlined" size="large" color="secondary" onClick={() => navigate("/profile")}>
              Profilul Meu
            </Button>
          </Box>
        </CardContent>
      </Card>
    </div>
  );
};

export default Home;
