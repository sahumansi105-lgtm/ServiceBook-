
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../CSS/Service.css";

export default function Services() {
  const navigate = useNavigate();

  const services = [
    {
      id: 1,
      name: "Carpenter",
      description:
        "Furniture repair, installation, drilling, and other carpentry services.",
      price: "Starting from ₹499",
      icon: "🪚",
    },
    {
      id: 2,
      name: "Electrician",
      description:
        "Electrical repair, wiring, switch installation, and troubleshooting.",
      price: "Starting from ₹399",
      icon: "⚡",
    },
    {
      id: 3,
      name: "Plumber",
      description:
        "Tap repair, pipe leakage, bathroom fittings, and plumbing services.",
      price: "Starting from ₹399",
      icon: "🔧",
    },
    {
      id: 4,
      name: "AC Repair",
      description:
        "AC servicing, installation, maintenance, and repair services.",
      price: "Starting from ₹599",
      icon: "❄️",
    },
    {
      id: 5,
      name: "Cleaning",
      description:
        "Home, bathroom, kitchen, and deep cleaning services.",
      price: "Starting from ₹499",
      icon: "🧹",
    },
    {
      id: 6,
      name: "Painting",
      description:
        "Home painting, wall painting, touch-ups, and color consultation.",
      price: "Starting from ₹999",
      icon: "🎨",
    },
  ];

  const handleBook = (service) => {
    const storedUser = localStorage.getItem("user");

    // User is not logged in
    if (!storedUser) {
      toast.warning("Please login or register first");

      navigate("/login");

      return;
    }

    // User is logged in
    navigate("/book-service", {
      state: {
        service: service,
      },
    });
  };

  return (
    <div className="services-page">

      {/* Header Section */}
      <section className="services-header">
        <h1>Our Services</h1>

        <p>
          Choose a service and book a professional
          at your convenient time.
        </p>
      </section>

      {/* Services */}
      <section className="services-container">

        {services.map((service) => (
          <div
            className="service-card"
            key={service.id}
          >

            <div className="service-icon">
              {service.icon}
            </div>

            <h2>{service.name}</h2>

            <p>
              {service.description}
            </p>

            <h3>{service.price}</h3>

            <button
              onClick={() => handleBook(service)}
            >
              Book Now
            </button>

          </div>
        ))}

      </section>

    </div>
  );
}
