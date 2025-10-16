import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function NotFound() {
  const [count, setCount] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    if (count > 0) {
      const timer = setTimeout(() => {
        setCount(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      navigate("/");
    }
  }, [count, navigate]);

  return (
    <CustomMainLayout>
      <ErrorContainer>
        <ErrorCard>
          <p>4❤️4</p>
          <p>PAGE NOT FOUND</p>
          <Divider>💫</Divider>
          <p>You are in wrong page</p>
          <p>Redirecting to Home Page in {count}</p>
        </ErrorCard>
      </ErrorContainer>
    </CustomMainLayout>
  );
}

export default NotFound;
