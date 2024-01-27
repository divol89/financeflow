// import { Card, Heading, Skeleton, Stack, Text } from "@chakra-ui/react";
// import { useAddress, useContract, useTokenBalance } from "@thirdweb-dev/react";
// import { STAKE_TOKEN_ADDRESSES } from "../erc20/addresses";

// export default function StakeToken() {
//     const address = useAddress();
//     const { contract: stakeTokenContract, isLoading: loadingStakeToken } = useContract(STAKE_TOKEN_ADDRESSES);

//     const { data: tokenBalance, isLoading: loadingTokenBalance } = useTokenBalance(stakeTokenContract, address);

//     return (
//         <Card p={5}>
//             <Stack>
//                 <Heading>Stake Token</Heading>
//                 <Skeleton h={4} w={"50%"} isLoaded={!loadingStakeToken && !loadingTokenBalance}>
//                     <Text fontSize={"large"} fontWeight={"bold"}>${tokenBalance?.symbol}</Text>
//                 </Skeleton>
//                 <Skeleton h={4} w={"100%"} isLoaded={!loadingStakeToken && !loadingTokenBalance}>
//                     <Text>{tokenBalance?.displayValue}</Text>
//                 </Skeleton>
//             </Stack>
//         </Card>
//     )
// }

import {
  Card,
  Heading,
  Skeleton,
  Stack,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useAddress, useContract, useTokenBalance } from "@thirdweb-dev/react";
import { STAKE_TOKEN_ADDRESSES } from "../erc20/addresses";

export default function StakeToken() {
  const address = useAddress();
  const { contract: stakeTokenContract, isLoading: loadingStakeToken } =
    useContract(STAKE_TOKEN_ADDRESSES);

  const { data: tokenBalance, isLoading: loadingTokenBalance } =
    useTokenBalance(stakeTokenContract, address);

  const fontSize = useBreakpointValue({ base: "md", md: "large" });

  return (
    <Card className="bg-gradient-to-t from-orange-500 to-gray-300" p={5}>
      <Stack spacing={{ base: 2, md: 4 }}>
        <Heading fontSize={fontSize}>Flow Balance</Heading>
        <Skeleton
          h={4}
          w={{ base: "100%", md: "50%" }}
          isLoaded={!loadingStakeToken && !loadingTokenBalance}
        >
          <Text fontSize={fontSize} fontWeight={"bold"}>
            ${tokenBalance?.symbol}
          </Text>
        </Skeleton>
        <Skeleton
          h={4}
          w="100%"
          isLoaded={!loadingStakeToken && !loadingTokenBalance}
        >
          <Text fontSize={fontSize}>{tokenBalance?.displayValue}</Text>
        </Skeleton>
      </Stack>
    </Card>
  );
}
