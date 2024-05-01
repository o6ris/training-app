"use client";

import { useState, useEffect, useMemo } from "react";
import SelectField from "@core/ui/Fields/SelectField/SelectField";

function CreateSession() {
  const [muscles, setMuscles] = useState([]);
  const [muscleId, setMuscleId] = useState(new Set([]));
  const muscle = useMemo(
		() => Array.from(muscleId).join(', '),
		[muscleId]
	);
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  const getMuscles = async () => {
    try {
      const response = await fetch(
        `${baseUrl}/api/muscles`,
        { method: "GET" },
        {
          next: { revalidate: 10 },
        }
      );
      if (response) {
        console.log("response", response);
        const muscles = await response.json();
        if (muscles) {
          console.log("muscles", muscles);
          setMuscles(muscles);
        }
      }
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    getMuscles();
  }, []);

  return (
    <>
      {" "}
      <SelectField
        items={muscles?.map((muscle) => {
          return {
            key: muscle._id,
            value: `${muscle.name.charAt(0).toUpperCase()}${muscle.name.slice(
              1
            )}`,
          };
        })}
        label="Muscle"
        placeholder="Choose muscle"
        labelPlacement="outside"
        variant="bordered"
        selectOnChange={setMuscleId}
        value={muscleId}
      />
    </>
  );
}

export default CreateSession;
