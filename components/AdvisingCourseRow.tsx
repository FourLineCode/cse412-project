import { Button, Td, Text, Tr, useToast } from "@chakra-ui/react";
import { ArrowRight } from "phosphor-react";
import { useState } from "react";
import { Course } from "../server/types/Course";
import { useAuth } from "../stores/useAuth";

export function AdvisingCourseRow({
  course,
  adding,
  setAdding,
  getCourses,
  getAdvisings,
}: {
  course: Course;
  adding: boolean;
  setAdding: (...args: any) => void;
  getCourses: () => Promise<void>;
  getAdvisings: () => Promise<void>;
}) {
  const { userId } = useAuth();
  const toast = useToast();
  const [current, setCurrent] = useState(false);

  const addCourse = async () => {
    setAdding(true);
    setCurrent(true);

    const res = await fetch("/api/advising", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ studentId: userId, courseId: course._id }),
    });
    const data = await res.json();

    if (data.success) {
      await getCourses();
      await getAdvisings();
      toast({
        title: "Course added successfully",
        status: "success",
        duration: 3000,
        isClosable: false,
      });
    } else {
      toast({
        title: data.message,
        status: "error",
        duration: 3000,
        isClosable: false,
      });
    }

    setCurrent(false);
    setAdding(false);
  };

  return (
    <Tr>
      <Td>{course.code}</Td>
      <Td isNumeric>{course.section}</Td>
      <Td isNumeric>{course.credit}</Td>
      <Td>
        <Text>{`${course.classSlot} ${course.classStart} - ${course.classEnd}`}</Text>
        {course.hasLab && (
          <Text>{`Lab ${course.labSlot} ${course.labStart} - ${course.labEnd}`}</Text>
        )}
      </Td>
      <Td>{`${course.takenSeats} / ${course.maxSeats}`}</Td>
      <Td>
        <Button
          isLoading={adding}
          variant="outline"
          colorScheme="green"
          onClick={addCourse}
          rightIcon={<ArrowRight weight="bold" />}
          visibility={!adding || (adding && current) ? "visible" : "hidden"}
        >
          Add
        </Button>
      </Td>
    </Tr>
  );
}
