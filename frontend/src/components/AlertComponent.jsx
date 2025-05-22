import { useState } from "react";
import Alert from "react-bootstrap/Alert";

export const useAlert = () => {
  const [alert, setAlert] = useState(null);

  const showAlert = (message, variant = "success") => {
    setAlert({ message, variant });
    setTimeout(() => {
      setAlert(null);
    }, 3000);
  };

  const AlertComponent = () => (
    <>
      {alert && (
        <Alert
          variant={alert.variant}
          onClose={() => setAlert(null)}
          dismissible
          className="mb-3"
        >
          {alert.message}
        </Alert>
      )}
    </>
  );

  return { showAlert, AlertComponent };
};
