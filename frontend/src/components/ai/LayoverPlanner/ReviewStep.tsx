interface ReviewStepProps {
    formData: {
      departureAirport: string;
      layoverAirport: string;
      destinationAirport: string;
  
      arrivalDate: string;
      arrivalTime: string;
  
      departureDate: string;
      departureTime: string;
  
      budget: string;
  
      travelStyle: string;
  
      visaRequired: boolean;
      checkedBaggage: boolean;
      loungeAccess: boolean;
  
      interests: string[];
    };
  }
  
  export default function ReviewStep({
    formData,
  }: ReviewStepProps) {
    return (
      <div className="space-y-8">
  
        <div>
  
          <h2 className="text-3xl font-bold">
            Review Your Layover
          </h2>
  
          <p className="mt-2 text-gray-500">
            Verify your flight information before AI creates your
            personalized layover experience.
          </p>
  
        </div>
  
        <div className="grid gap-6 md:grid-cols-2">
  
          {/* Flight Route */}
  
          <div className="rounded-2xl border p-6">
  
            <h3 className="text-lg font-semibold">
              Flight Route
            </h3>
  
            <div className="mt-4 space-y-2">
  
              <p>
                <strong>Departure:</strong>{" "}
                {formData.departureAirport}
              </p>
  
              <p>
                <strong>Layover:</strong>{" "}
                {formData.layoverAirport}
              </p>
  
              <p>
                <strong>Destination:</strong>{" "}
                {formData.destinationAirport}
              </p>
  
            </div>
  
          </div>
  
          {/* Layover Schedule */}
  
          <div className="rounded-2xl border p-6">
  
            <h3 className="text-lg font-semibold">
              Layover Schedule
            </h3>
  
            <div className="mt-4 space-y-2">
  
              <p>
                <strong>Arrival</strong>
              </p>
  
              <p className="text-gray-600">
                {formData.arrivalDate} • {formData.arrivalTime}
              </p>
  
              <p className="pt-3">
                <strong>Departure</strong>
              </p>
  
              <p className="text-gray-600">
                {formData.departureDate} • {formData.departureTime}
              </p>
  
            </div>
  
          </div>
  
          {/* Budget */}
  
          <div className="rounded-2xl border p-6">
  
            <h3 className="text-lg font-semibold">
              Budget
            </h3>
  
            <p className="mt-4 text-3xl font-bold text-emerald-600">
              ₹{formData.budget || "0"}
            </p>
  
          </div>
  
          {/* Preferences */}
  
          <div className="rounded-2xl border p-6">
  
            <h3 className="text-lg font-semibold">
              Preferences
            </h3>
  
            <div className="mt-4 space-y-2">
  
              <p>
                <strong>Style:</strong>{" "}
                {formData.travelStyle}
              </p>
  
              <p>
                <strong>Lounge:</strong>{" "}
                {formData.loungeAccess ? "Yes" : "No"}
              </p>
  
              <p>
                <strong>Checked Baggage:</strong>{" "}
                {formData.checkedBaggage ? "Yes" : "No"}
              </p>
  
              <p>
                <strong>Transit Visa:</strong>{" "}
                {formData.visaRequired ? "Required" : "Not Required"}
              </p>
  
            </div>
  
          </div>
  
        </div>
  
        {/* Interests */}
  
        <div className="rounded-2xl border p-6">
  
          <h3 className="mb-4 text-lg font-semibold">
            Interests
          </h3>
  
          <div className="flex flex-wrap gap-3">
  
            {formData.interests.length === 0 ? (
  
              <p className="text-gray-500">
                No interests selected.
              </p>
  
            ) : (
  
              formData.interests.map((interest) => (
  
                <span
                  key={interest}
                  className="rounded-full bg-blue-100 px-4 py-2 text-blue-700"
                >
                  {interest}
                </span>
  
              ))
  
            )}
  
          </div>
  
        </div>
  
      </div>
    );
  }