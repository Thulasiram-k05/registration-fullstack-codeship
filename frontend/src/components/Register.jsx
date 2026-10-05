import { useEffect, useState } from "react";
// import "./App.css";

const API_URL = "http://127.0.0.1:8000/api/registration/";

const initialForm = {
  name: "",
  phone_number: "",
  gmail: "",
  date: "",
  company_name: "",
};

export default function RegisterPage() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);

  const [status, setStatus] = useState({
    type: "",
    message: "",
  });

  // =========================
  // GET DATA
  // =========================
  const getRegistrations = async () => {
    setTableLoading(true);

    try {
      const res = await fetch(API_URL);

      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await res.json();

      setRegistrations(data);
    } catch (error) {
      console.error("GET Error:", error);

      setStatus({
        type: "error",
        message: "Could not load registration data.",
      });
    } finally {
      setTableLoading(false);
    }
  };

  // Load table when page opens
  useEffect(() => {
    getRegistrations();
  }, []);

  // =========================
  // INPUT CHANGE
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    let newValue = value;

    if (name === "phone_number") {
      newValue = value.replace(/\D/g, "").slice(0, 10);
    }

    setForm((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    setStatus({
      type: "",
      message: "",
    });
  };

  // =========================
  // VALIDATION
  // =========================
  const validate = () => {
    const err = {};

    if (!form.name.trim()) {
      err.name = "Enter your name";
    } else if (!/^[A-Za-z ]+$/.test(form.name.trim())) {
      err.name = "Name can contain only letters and spaces";
    }

    if (!form.phone_number) {
      err.phone_number = "Enter your phone number";
    } else if (!/^[6-9]\d{9}$/.test(form.phone_number)) {
      err.phone_number = "Enter a valid 10-digit phone number";
    }

    if (!form.gmail.trim()) {
      err.gmail = "Enter your email";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.gmail.trim())
    ) {
      err.gmail = "Enter a valid email address";
    }

    if (!form.date) {
      err.date = "Pick a date";
    }

    if (!form.company_name.trim()) {
      err.company_name = "Enter company name";
    }

    return err;
  };

  // =========================
  // POST DATA
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const err = validate();

    if (Object.keys(err).length > 0) {
      setErrors(err);
      return;
    }

    setLoading(true);

    setStatus({
      type: "",
      message: "",
    });

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name.trim(),
          phone_number: form.phone_number,
          gmail: form.gmail.trim(),
          date: form.date,
          company_name: form.company_name.trim(),
        }),
      });

      const data = await res.json().catch(() => null);

      if (res.ok) {
        setStatus({
          type: "success",
          message: "Registration completed successfully!",
        });

        // Clear form
        setForm(initialForm);
        setErrors({});

        // Refresh GET table
        getRegistrations();

        console.log("Backend response:", data);
      } else {
        if (data) {
          const backendErrors = {};

          Object.entries(data).forEach(([field, messages]) => {
            backendErrors[field] = Array.isArray(messages)
              ? messages[0]
              : String(messages);
          });

          setErrors(backendErrors);
        }
      }
    } catch (error) {
      console.error("POST Error:", error);

      setStatus({
        type: "error",
        message:
          "Could not reach the Django server. Make sure the backend is running.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reg-wrap">

      {/* =========================
          REGISTRATION FORM
      ========================= */}
      <form
        className="reg-form"
        onSubmit={handleSubmit}
        noValidate
      >
        <h2>Register</h2>

        {/* Name */}
        <label htmlFor="name">
          Name

          <input
            id="name"
            name="name"
            type="text"
            placeholder="Enter your name"
            value={form.name}
            onChange={handleChange}
          />

          {errors.name && (
            <span className="err">
              {errors.name}
            </span>
          )}
        </label>

        {/* Phone */}
        <label htmlFor="phone_number">
          Phone Number

          <input
            id="phone_number"
            name="phone_number"
            type="tel"
            placeholder="10-digit phone number"
            inputMode="numeric"
            maxLength={10}
            value={form.phone_number}
            onChange={handleChange}
          />

          {errors.phone_number && (
            <span className="err">
              {errors.phone_number}
            </span>
          )}
        </label>

        {/* Gmail */}
        <label htmlFor="gmail">
          Email

          <input
            id="gmail"
            name="gmail"
            type="email"
            placeholder="example@gmail.com"
            value={form.gmail}
            onChange={handleChange}
          />

          {errors.gmail && (
            <span className="err">
              {errors.gmail}
            </span>
          )}
        </label>

        {/* Date */}
        <label htmlFor="date">
          Date

          <input
            id="date"
            name="date"
            type="date"
            value={form.date}
            onChange={handleChange}
          />

          {errors.date && (
            <span className="err">
              {errors.date}
            </span>
          )}
        </label>

        {/* Company */}
        <label htmlFor="company_name">
          Company Name

          <input
            id="company_name"
            name="company_name"
            type="text"
            placeholder="Enter company name"
            value={form.company_name}
            onChange={handleChange}
          />

          {errors.company_name && (
            <span className="err">
              {errors.company_name}
            </span>
          )}
        </label>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
        >
          {loading ? "Saving..." : "Register"}
        </button>

        {status.message && (
          <p className={`status ${status.type}`}>
            {status.message}
          </p>
        )}
      </form>


      {/* =========================
          GET TABLE
      ========================= */}
      <div className="table-section">

        <div className="table-header">
          <h2>Registered Users</h2>

          <button
            type="button"
            onClick={getRegistrations}
            disabled={tableLoading}
          >
            {tableLoading ? "Loading..." : "Refresh"}
          </button>
        </div>

        {tableLoading ? (
          <p>Loading registration data...</p>
        ) : registrations.length === 0 ? (
          <p>No registrations found.</p>
        ) : (
          <div className="table-container">

            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Gmail</th>
                  <th>Date</th>
                  <th>Company</th>
                </tr>
              </thead>

              <tbody>
                {registrations.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.phone_number}</td>
                    <td>{user.gmail}</td>
                    <td>{user.date}</td>
                    <td>{user.company_name}</td>
                  </tr>
                ))}
              </tbody>
            </table>

          </div>
        )}

      </div>

    </div>
  );
}