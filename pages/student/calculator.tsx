import {
  Box,
  Button,
  FormLabel,
  HStack,
  IconButton,
  Input,
  NumberInput,
  NumberInputField,
  Select,
  Text,
} from "@chakra-ui/react";
import { Plus, Trash } from "phosphor-react";
import { useState } from "react";
import { AuthProvider } from "../../components/AuthProvider";
import { Layout } from "../../components/Layout";

export default function StudentCalculatorPage() {
  const [currCGPA, setCurrCGPA] = useState("0");
  const [currCredit, setCurrCredit] = useState("0");
  const [grades, setGrades] = useState([{ course: "", credit: "4.5", cgpa: "4.00" }]);
  const [calculated, setCalculated] = useState(0);

  const calculate = () => {
    const weightTotal = grades.reduce(
      (acc, grade) => acc + Number(grade.cgpa) * Number(grade.credit),
      0
    );
    const totalCredit = grades.reduce((acc, grade) => acc + Number(grade.credit), 0);
    const semGrade = weightTotal / totalCredit;

    const finalGrade =
      (Number(currCGPA) * Number(currCredit) + semGrade * totalCredit) /
      (Number(currCredit) + totalCredit);

    setCalculated(finalGrade);
  };

  return (
    <AuthProvider role="student">
      <Layout>
        <Box
          p="4"
          my="4"
          w="100%"
          mx="auto"
          maxW="4xl"
          rounded="lg"
          bg="gray.300"
          _dark={{ bg: "gray.900" }}
        >
          <Text textAlign="center" fontSize="24" fontWeight="bold">
            CGPA Calculator
          </Text>
          <Box>
            <HStack>
              <Text w="100%" fontWeight="semibold" textAlign="center">
                Course Code (Optional )
              </Text>
              <Text w="100%" fontWeight="semibold" textAlign="center">
                Credit
              </Text>
              <Text w="100%" fontWeight="semibold" textAlign="center">
                Grade
              </Text>
            </HStack>
            {grades.map((grade, index) => (
              <HStack my="2">
                <Input
                  placeholder="Course Code..."
                  value={grade.course}
                  onChange={(e) =>
                    setGrades((prev) =>
                      prev.map((g, i) => (i !== index ? g : { ...g, course: e.target.value }))
                    )
                  }
                />
                <Select
                  value={grade.credit}
                  onChange={(e) =>
                    setGrades((prev) =>
                      prev.map((g, i) => (i !== index ? g : { ...g, credit: e.target.value }))
                    )
                  }
                >
                  <option value="4.5">4.5</option>
                  <option value="4">4</option>
                  <option value="3">3</option>
                  <option value="2">2</option>
                  <option value="1">1</option>
                </Select>
                <Select
                  value={grade.cgpa}
                  onChange={(e) =>
                    setGrades((prev) =>
                      prev.map((g, i) => (i !== index ? g : { ...g, cgpa: e.target.value }))
                    )
                  }
                >
                  <option value="4.00">A+/A (4.00)</option>
                  <option value="3.70">A- (3.70)</option>
                  <option value="3.30">B+ (3.30)</option>
                  <option value="3.00">B (3.00)</option>
                  <option value="2.70">B- (2.70)</option>
                  <option value="2.30">C+ (2.30)</option>
                  <option value="2.00">C (2.00)</option>
                  <option value="1.70">C- (1.70)</option>
                  <option value="1.30">D+ (1.30)</option>
                  <option value="1.00">D (1.00)</option>
                  <option value="0.00">F (0.00)</option>
                </Select>
                <IconButton
                  icon={<Trash color="red" />}
                  aria-label="delete"
                  onClick={() => setGrades((prev) => prev.filter((_, i) => index !== i))}
                />
              </HStack>
            ))}
            <Button
              w="100%"
              mt="2"
              variant="outline"
              onClick={() =>
                setGrades((prev) => prev.concat([{ course: "", credit: "4.5", cgpa: "4.00" }]))
              }
              leftIcon={<Plus color="white" />}
            >
              Add Course
            </Button>
            <HStack mt="4" spacing="6">
              <NumberInput value={currCGPA} w="100%" min={0} max={4}>
                <FormLabel htmlFor="cgpa">Current CGPA</FormLabel>
                <NumberInputField
                  name="cgpa"
                  placeholder="Current CGPA..."
                  value={currCGPA}
                  onChange={(e) => setCurrCGPA(e.target.value)}
                />
              </NumberInput>
              <NumberInput value={currCredit} w="100%" min={0} max={200}>
                <FormLabel htmlFor="credit">Current Credit</FormLabel>
                <NumberInputField
                  name="credit"
                  placeholder="Current Credits..."
                  value={currCredit}
                  onChange={(e) => setCurrCredit(e.target.value)}
                />
              </NumberInput>
            </HStack>
            <Button w="100%" mt="4" colorScheme="blue" onClick={calculate}>
              Calculate
            </Button>
            <HStack mt="6" justify="center">
              <Text fontSize="28" fontWeight="semibold">
                Calculated CGPA:
              </Text>
              <Text fontSize="28" fontWeight="extrabold">
                {calculated.toFixed(2)}
              </Text>
            </HStack>
          </Box>
        </Box>
      </Layout>
    </AuthProvider>
  );
}
