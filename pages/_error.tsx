// pages/_error.tsx
import Error from "next/error";

interface ErrorProps {
  statusCode: number;
}

const CustomErrorComponent = ({ statusCode }: ErrorProps) => {
  return <Error statusCode={statusCode} />;
};

export default CustomErrorComponent;