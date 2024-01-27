import { Box, Text, Flex } from "@chakra-ui/react";

const StakingInfoBox = () => {
  return (
    <Box mt={4} p={2} boxShadow="md" borderRadius="lg" textAlign="center">
      <Flex align="center" justify="center">
        <Box>
          <Text
            className="text-black font-extrabold"
            align="center"
            fontSize="xl"
          >
            <span className="text-orange-700 font-extrabold">FlowFarm</span>{" "}
            Staking
          </Text>
          <Text className="text-black font-bold" mt={1}>
            Stake your Flow tokens to earn rewards and unlock new features.
          </Text>
        </Box>
      </Flex>
    </Box>
  );
};

export default StakingInfoBox;
