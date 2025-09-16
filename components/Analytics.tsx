import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Eye } from "lucide-react";

type Props = {
  numberOfSubmissions: number,
};

const Analytics: React.FC<Props> = ({ numberOfSubmissions }) => {
  return (
    <div>
      <Card className="w-[350px] shadow-md shadow-yellow-600">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-bold">My forms</CardTitle>
          <Eye />
        </CardHeader>
        <CardContent>
          <div>{numberOfSubmissions}</div>
          <p>Total submissions to your forms.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
