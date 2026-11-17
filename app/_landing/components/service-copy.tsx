import { services } from "../copy";

export function ServiceCopy({
  service,
  title = services[service].title,
  description = services[service].description,
}: {
  service: keyof typeof services;
  title?: string;
  description?: string;
}) {
  return (
    <div className="studio-service-copy">
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}
