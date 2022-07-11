import { Center, Code, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";

export default function Home() {
  const [mongoData, setMongoData] = useState(null);

  useEffect(() => {
    fetch("/api/hello")
      .then((res) => res.json())
      .then((data) => {
        setMongoData(data);
      });
  });

  return (
    <Center w="100vw" h="100vh" bg="gray.900">
      <VStack>
        <Text fontSize={32} fontWeight="extrabold" color="gray.100">
          CSE412 Project
        </Text>
        <Code>Data from DB: {JSON.stringify(mongoData, null, 2)}</Code>
      </VStack>
    </Center>
  );
}
