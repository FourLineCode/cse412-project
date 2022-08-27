import { IconButton, Td, Text, Tr, useToast } from "@chakra-ui/react";
import { Trash } from "phosphor-react";
import { useState } from "react";
import { Advising } from "../server/types/Course";

export function AdvisingRow({
  advising,
  getAdvisings,
  getCourses,
}: {
  advising: Advising;
  getCourses: () => Promise<void>;
  getAdvisings: () => Promise<void>;
}) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const removeAdvising = async () => {
    setLoading(true);

    const res = await fetch(`/api/advising?id=${encodeURIComponent(advising._id)}`, {
      method: "DELETE",
    });
    const data = await res.json();

    if (data.success) {
      await getAdvisings();
      await getCourses();
      toast({
        title: "Course removed successfully",
        status: "success",
        duration: 3000,
        isClosable: false,
      });
    }

    setLoading(false);
  };

  return (
    <Tr>
      <Td>{advising.course.code}</Td>
      <Td isNumeric>{advising.course.section}</Td>
      <Td isNumeric>{advising.course.credit}</Td>
      <Td>
        <Text>{`${advising.course.classSlot} ${advising.course.classStart} - ${advising.course.classEnd}`}</Text>
        {advising.course.hasLab && (
          <Text>{`Lab ${advising.course.labSlot} ${advising.course.labStart} - ${advising.course.labEnd}`}</Text>
        )}
      </Td>
      <Td>
        <IconButton
          colorScheme="red"
          isLoading={loading}
          onClick={removeAdvising}
          aria-label="trash"
          icon={<Trash weight="fill" />}
        />
      </Td>
    </Tr>
  );
}
