import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getSingleLink } from "../api/linkService";

export default function Stats() {
  const { code } = useParams();
  const [link, setLink] = useState(null);

  useEffect(() => {
    getSingleLink(code)
      .then((res) => setLink(res.data))
      .catch(() => alert("Not found"));
  }, [code]);

  if (!link) return <p className="text-center mt-5">Loading...</p>;

  return (
    <div className="container mt-4">
      <h2>Stats for: {code}</h2>
      <p><strong>URL:</strong> {link.targetUrl}</p>
      <p><strong>Total Clicks:</strong> {link.clicks}</p>
      <p><strong>Last Clicked:</strong> {link.lastClicked ? new Date(link.lastClicked).toLocaleString() : "Never"}</p>

      <a href="/" className="btn btn-secondary mt-3">Back</a>
    </div>
  );
}
