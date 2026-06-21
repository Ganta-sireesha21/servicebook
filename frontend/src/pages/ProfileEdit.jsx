import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../utils/api";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";

function ProfileEdit() {
  const [form, setForm] = useState({ name: "", phone: "", profile_image: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    apiFetch("/profile")
      .then((profile) => setForm({ name: profile.name, phone: profile.phone || "", profile_image: profile.profile_image || "" }))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (field) => (event) => setForm((prev) => ({ ...prev, [field]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await apiFetch("/profile", { method: "PUT", body: JSON.stringify(form) });
      navigate("/profile");
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <Loading message="Loading profile..." />;

  return (
    <div className="panel form-panel">
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit} className="form-grid">
        <label>
          Name
          <input value={form.name} onChange={handleChange("name")} required />
        </label>
        <label>
          Phone
          <input value={form.phone} onChange={handleChange("phone")} />
        </label>
        <label>
          Profile Image URL
          <input value={form.profile_image} onChange={handleChange("profile_image")} />
        </label>
        <ErrorMessage message={error} />
        <button className="button primary" type="submit">Save changes</button>
      </form>
    </div>
  );
}

export default ProfileEdit;
