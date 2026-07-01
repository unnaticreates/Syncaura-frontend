import { useSearchParams } from "react-router-dom";

const GithubCallback = () => {
  const [searchParams] = useSearchParams();

  const code = searchParams.get("code");
  const state = searchParams.get("state"); // optional but good

  console.log("Callback Page Loaded");
  console.log("Authorization Code:", code);
  console.log("State:", state);

  return (
    <div
      style={{
        backgroundColor: "white",
        color: "black",
        minHeight: "100vh",
        padding: "40px",
      }}
    >
      <h1>GitHub OAuth Callback Page</h1>

      <p>
        Authorization Code: {code || "No code received"}
      </p>
    </div>
  );
};

export default GithubCallback;