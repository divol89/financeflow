

 
// import {
//     Box,
//     Card,
//     Flex,
//     Heading,
//     Input,
//     SimpleGrid,
//     Skeleton,
//     Stack,
//     Text,
//     useBreakpointValue,
//     useToast,
// } from "@chakra-ui/react";
// import {
//     Web3Button,
//     useAddress,
//     useContract,
//     useContractRead,
//     useTokenBalance,
// } from "@thirdweb-dev/react";
// import {
//     REWARD_TOKEN_ADDRESSES,
//     STAKE_CONTRACT_ADDRESSES,
//     STAKE_TOKEN_ADDRESSES,
// } from "../erc20/addresses";
// import React, { useEffect, useState } from "react";
// import { ethers } from "ethers";

// export default function Stake() {
//     const FEE_PERCENTAGE = 0.01;  // 1%

//     const address = useAddress();
//     const { contract: stakeTokenContract } = useContract(STAKE_TOKEN_ADDRESSES, "token");
//     const { contract: rewardTokenContract } = useContract(REWARD_TOKEN_ADDRESSES, "token");
//     const { contract: stakeContract } = useContract(STAKE_CONTRACT_ADDRESSES, "custom");
//     const { data: stakeInfo, refetch: refetchStakeInfo, isLoading: loadingStakeInfo } = useContractRead(stakeContract, "getStakeInfo", [address]);
//     const { data: stakeTokenBalance, isLoading: loadingStakeTokenBalance } = useTokenBalance(stakeTokenContract, address);
//     const { data: rewardTokenBalance, isLoading: loadingRewardTokenBalance } = useTokenBalance(rewardTokenContract, address);
    
//     useEffect(() => {
//         setInterval(() => {
//             refetchStakeInfo();
//         }, 10000);
//     }, []);

//     const [stakeAmount, setStakeAmount] = useState<string>("0");
//     const [unstakeAmount, setUnstakeAmount] = useState<string>("0");
//     const toast = useToast();

//     const fontSize = useBreakpointValue({ base: "sm", md: "large" });
//     const cardMargin = useBreakpointValue({ base: 2, md: 5 });

//     const stakedAmount = stakeInfo ? parseFloat(ethers.utils.formatEther(stakeInfo[0])) : 0;
//     const amountAfterFee = stakedAmount * (1 - FEE_PERCENTAGE);

//   function resetValue() {
//     throw new Error("Function not implemented.");
//   }

//     return (
//         <Card p={5} mt={10}>
//             <Heading fontSize={fontSize}>Earn Reward Token</Heading>
//             <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
//                 <Card p={5} m={cardMargin}>
//                     <Box textAlign={"center"} mb={5}>
//                         <Text fontSize={"xl"} fontWeight={"bold"}>
//                             Tokens in Staking
//                         </Text>
//                         <Skeleton isLoaded={!loadingStakeInfo && !loadingStakeTokenBalance}>
//                             <Text>
//                                 {amountAfterFee.toFixed(4)}
//                                 {" $" + stakeTokenBalance?.symbol}
//                             </Text>
//                         </Skeleton>
//                     </Box>
//                     <SimpleGrid columns={{ base: 1, md: 1 }} spacing={4}>
//                         <Stack spacing={6} justifyContent="center">
//                             <Input
//                                 type="number"
//                                 max={stakeTokenBalance?.displayValue}
//                                 value={stakeAmount}
//                                 onChange={(e) => setStakeAmount(e.target.value)}
//                             />
//                             <Web3Button
//                                 style={{
//                                     background: "linear-gradient(to top, #FF914D, #FF914D)",
//                                 }}
//                                 contractAddress={STAKE_CONTRACT_ADDRESSES}
//                                 action={async (contract) => {
//                                     await stakeTokenContract?.erc20.setAllowance(STAKE_CONTRACT_ADDRESSES, stakeAmount);
//                                     await contract.call("stake", [ethers.utils.parseEther(stakeAmount)]);
//                                     resetValue();
//                                 }}
//                                 onSuccess={() =>
//                                     toast({
//                                         title: "Stake Successful",
//                                         status: "success",
//                                         duration: 5000,
//                                         isClosable: true,
//                                     })
//                                 }
//                             >
//                                 Stake
//                             </Web3Button>
//                         </Stack>
//                         <Stack spacing={6} justifyContent="center">
//                             <Input
//                                 type="number"
//                                 max={amountAfterFee.toString()}
//                                 value={unstakeAmount}
//                                 onChange={(e) => setUnstakeAmount(e.target.value)}
//                             />
//                             <Web3Button
//                                 style={{
//                                     background: "linear-gradient(to top, #FF914D, #FF914D)",
//                                 }}
//                                 contractAddress={STAKE_CONTRACT_ADDRESSES}
//                                 action={async (contract) => {
//                                     await contract.call("withdrawWithFee", [ethers.utils.parseEther(unstakeAmount)]);
//                                 }}
//                                 onSuccess={() =>
//                                     toast({
//                                         title: "Unstake Successful",
//                                         status: "success",
//                                         duration: 5000,
//                                         isClosable: true,
//                                     })
//                                 }
//                             >
//                                 Unstake
//                             </Web3Button>
//                         </Stack>
//                     </SimpleGrid>
//                 </Card>
//                 <Card p={5} m={5}>
//                     <Flex
//                         h={"100%"}
//                         justifyContent={"space-between"}
//                         direction={"column"}
//                         textAlign={"center"}
//                     >
//                         <Text fontSize={"xl"} fontWeight={"bold"}>
//                             Accumulated Gains
//                         </Text>
//                         <Skeleton
//                             isLoaded={!loadingStakeInfo && !loadingRewardTokenBalance}
//                         >
//                             {stakeInfo && stakeInfo[0] ? (
//                                 <Box>
//                                     <Text fontSize={"ms"} fontWeight={"small"}>
//                                         {ethers.utils.formatEther(stakeInfo[1])}
//                                     </Text>
//                                     <Text>{" $" + rewardTokenBalance?.symbol}</Text>
//                                 </Box>
//                             ) : (
//                                 <Text>0</Text>
//                             )}
//                         </Skeleton>
//                         <Web3Button
//                             style={{
//                                 background: "linear-gradient(to top, #FF914D, #FF914D)",
//                             }}
//                             contractAddress={STAKE_CONTRACT_ADDRESSES}
//                             action={async (contract) => {
//                                 await contract.call("claimRewards");
//                             }}
//                             onSuccess={() =>
//                                 toast({
//                                     title: "Rewards Claimed",
//                                     status: "success",
//                                     duration: 5000,
//                                     isClosable: true,
//                                 })
//                             }
//                         >
//                             Claim
//                         </Web3Button>
//                     </Flex>
//                 </Card>
//             </SimpleGrid>
//         </Card>
//     );
// }

// import {
//   Box, Card, Flex, Heading, Input, SimpleGrid, Skeleton, Stack, Text,
//   useBreakpointValue, useToast,
// } from "@chakra-ui/react";
// import {
//   Web3Button, useAddress, useContract, useContractRead, useTokenBalance,
// } from "@thirdweb-dev/react";
// import { REWARD_TOKEN_ADDRESSES, STAKE_CONTRACT_ADDRESSES, STAKE_TOKEN_ADDRESSES } from "../erc20/addresses";
// import React, { useEffect, useState } from "react";
// import { ethers } from "ethers";

// export default function Stake() {
//   const address = useAddress();
//   const feePercentage = 1; // 1% como está en el contrato

//   const { contract: stakeTokenContract } = useContract(STAKE_TOKEN_ADDRESSES, "token");
//   const { contract: rewardTokenContract } = useContract(REWARD_TOKEN_ADDRESSES, "token");
//   const { contract: stakeContract } = useContract(STAKE_CONTRACT_ADDRESSES, "custom");

//   const {
//     data: stakeInfo, refetch: refetchStakeInfo, isLoading: loadingStakeInfo,
//   } = useContractRead(stakeContract, "getStakeInfo", [address]);

//   const { data: stakeTokenBalance, isLoading: loadingStakeTokenBalance } = useTokenBalance(stakeTokenContract, address);
//   const { data: rewardTokenBalance, isLoading: loadingRewardTokenBalance } = useTokenBalance(rewardTokenContract, address);

//   useEffect(() => {
//     setInterval(() => {
//       refetchStakeInfo();
//     }, 10000);
//   }, []);

//   const [stakeAmount, setStakeAmount] = useState<string>("0");
//   const [unstakeAmount, setUnstakeAmount] = useState<string>("0");

//   function resetValue() {
//     setStakeAmount("0");
//     setUnstakeAmount("0");
//   }

//   const toast = useToast();

//   const fontSize = useBreakpointValue({ base: "sm", md: "large" });
//   const cardMargin = useBreakpointValue({ base: { base: 2, md: 5 } });

//   // Asumiendo que stakeInfo[0] contiene la cantidad total staked por el usuario:
//   const totalStaked = stakeInfo ? parseFloat(ethers.utils.formatEther(stakeInfo[0])) : 0;
//   // Calcula la cantidad después de deducir la tarifa:
//   const stakedAfterFee = totalStaked * (1 - feePercentage / 100);

//   return (
//     <Card p={5} mt={10}>
//       <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
//         <Card p={5} m={cardMargin}>
//           <Box textAlign={"center"} mb={5}>
//             <Text fontSize={"xl"} fontWeight={"bold"}>
//               Tokens in Staking
//             </Text>
//             <Skeleton isLoaded={!loadingStakeInfo && !loadingStakeTokenBalance}>
//               <Text>
//                 {stakedAfterFee.toFixed(2)}
//                 {" $" + stakeTokenBalance?.symbol}
//               </Text>
//             </Skeleton>
//           </Box>
//           <SimpleGrid columns={{ base: 1, md: 1 }} spacing={4}>
//             <Stack spacing={6} justifyContent="center">
//               <Input
//                 type="number"
//                 max={stakeTokenBalance?.displayValue}
//                 value={stakeAmount}
//                 onChange={(e) => setStakeAmount(e.target.value)}
//               />
//               <Web3Button
//                 style={{
//                   background: "linear-gradient(to top, #FF914D, #FF914D)"
//                 }}
//                 contractAddress={STAKE_CONTRACT_ADDRESSES}
//                 action={async (contract) => {
//                   await stakeTokenContract?.erc20.setAllowance(
//                     STAKE_CONTRACT_ADDRESSES,
//                     stakeAmount
//                   );
//                   await contract.call("stake", [
//                     ethers.utils.parseEther(stakeAmount),
//                   ]);
//                   resetValue();
//                 }}
//                 onSuccess={() =>
//                   toast({
//                     title: "Stake Successful",
//                     status: "success",
//                     duration: 5000,
//                     isClosable: true,
//                   })
//                 }
//               >
//                 Stake
//               </Web3Button>
//             </Stack>
//             <Stack spacing={6} justifyContent="center">
//               <Input
//                 type="number"
//                 value={unstakeAmount}
//                 onChange={(e) => setUnstakeAmount(e.target.value)}
//               />
//               <Web3Button
//                 style={{
//                   background: "linear-gradient(to top, #FF914D, #FF914D)"
//                 }}
//                 contractAddress={STAKE_CONTRACT_ADDRESSES}
//                 action={async (contract) => {
//                   await contract.call("withdrawWithFee", [
//                     ethers.utils.parseEther(unstakeAmount),
//                   ]);
//                   resetValue();

//                 }}
//                 onSuccess={() =>
//                   toast({
//                     title: "Unstake Successful",
//                     status: "success",
//                     duration: 5000,
//                     isClosable: true,
//                   })
//                 }
//               >
//                 Unstake
//               </Web3Button>
//             </Stack>
//           </SimpleGrid>
//         </Card>
//         <Card p={5} m={5}>
//           <Flex
//             h={"100%"}
//             justifyContent={"space-between"}
//             direction={"column"}
//             textAlign={"center"}
//           >
//             <Text fontSize={"xl"} fontWeight={"bold"}>
//               Accumulated Gains
//             </Text>
//             <Skeleton isLoaded={!loadingStakeInfo && !loadingRewardTokenBalance}>
//               {stakeInfo && stakeInfo[1] ? (
//                 <Box>
//                   <Text fontSize={"ms"} fontWeight={"small"}>
//                     {ethers.utils.formatEther(stakeInfo[1])}
//                   </Text>
//                   <Text>{" $" + rewardTokenBalance?.symbol}</Text>
//                 </Box>
//               ) : (
//                 <Text>0</Text>
//               )}
//             </Skeleton>
//             <Web3Button
//               style={{
//                 background: "linear-gradient(to top, #FF914D, #FF914D)"
//               }}
//               contractAddress={STAKE_CONTRACT_ADDRESSES}
//               action={async (contract) => {
//                 await contract.call("claimRewards");
//                 resetValue();
//               }}
//               onSuccess={() =>
//                 toast({
//                   title: "Rewards Claimed",
//                   status: "success",
//                   duration: 5000,
//                   isClosable: true,
//                 })
//               }
//             >
//               Claim
//             </Web3Button>
//           </Flex>
//         </Card>
//       </SimpleGrid>
//     </Card>
//   );
// }

    import {
    Box,
    Card,
    Flex,
    Heading,
    Input,
    SimpleGrid,
    Skeleton,
    Stack,
    Text,
    useBreakpointValue,
    useToast,
    } from "@chakra-ui/react";
    import {
    Web3Button,
    useAddress,
    useContract,
    useContractRead,
    useTokenBalance,
    } from "@thirdweb-dev/react";
    import {
    REWARD_TOKEN_ADDRESSES,
    STAKE_CONTRACT_ADDRESSES,
    STAKE_TOKEN_ADDRESSES,
    } from "../erc20/addresses";
    import React, { useEffect, useState } from "react";
    import { ethers } from "ethers";

    export default function Stake() {
    const address = useAddress();

useEffect(() => {
    if (!address) {
        // Limpia cualquier estado o efecto secundario aquí
        resetValue();
        // Puedes agregar registros de depuración para ayudarte a entender el flujo
        console.log("Billetera desconectada");
    }
}, [address]);


    const { contract: stakeTokenContract } = useContract(STAKE_TOKEN_ADDRESSES, "token");
    const { contract: rewardTokenContract } = useContract(REWARD_TOKEN_ADDRESSES, "token");
    const { contract: stakeContract } = useContract(STAKE_CONTRACT_ADDRESSES, "custom");

    const { data: stakeInfo, refetch: refetchStakeInfo } = useContractRead(stakeContract, "getStakeInfo", [address]);
    const { data: stakeTokenBalance } = useTokenBalance(stakeTokenContract, address);
    const { data: rewardTokenBalance } = useTokenBalance(rewardTokenContract, address);

    useEffect(() => {
        setInterval(() => {
            refetchStakeInfo();
        }, 10000);
    }, []);

    const [stakeAmount, setStakeAmount] = useState<string>("0");
    const [unstakeAmount, setUnstakeAmount] = useState<string>("0");

    function resetValue() {
        setStakeAmount("0");
        setUnstakeAmount("0");
    }

    function setMaxUnstakeAmount() {
        if (stakeInfo && stakeInfo[0]) {
            setUnstakeAmount(ethers.utils.formatEther(stakeInfo[0]));
        }
    }

    const toast = useToast();
    const fontSize = useBreakpointValue({ base: "sm", md: "large" });
    const cardMargin = useBreakpointValue({ base: { base: 2, md: 5 } });

    return (
        <Card className="bg-gradient-to-t from-orange-500 to-gray-300" p={5} mt={10}>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <Card  p={5} m={cardMargin}>
                    <Box textAlign={"center"} mb={5}>
                        <Text fontSize={"xl"} fontWeight={"bold"}>
                            Tokens in Staking
                        </Text>
                        <Skeleton isLoaded={Boolean(stakeInfo && stakeInfo[0])}>
                            <Text>
                                {stakeInfo && stakeInfo[0]
                                    ? ethers.utils.formatEther(stakeInfo[0])
                                    : "0"}
                                {" $" + stakeTokenBalance?.symbol}
                            </Text>
                        </Skeleton>
                    </Box>
                    <SimpleGrid columns={{ base: 1, md: 1 }} spacing={4}>
                        <Stack spacing={6} justifyContent="center">
                            <Input
                                type="number"
                                max={stakeTokenBalance?.displayValue}
                                value={stakeAmount}
                                onChange={(e) => setStakeAmount(e.target.value)}
                            />
                            <Web3Button
                                style={{
                                    background: "linear-gradient(to top, #FF914D, #FF914D)",
                                }}
                                contractAddress={STAKE_CONTRACT_ADDRESSES}
                                action={async (contract) => {
                                    await stakeTokenContract?.erc20.setAllowance(
                                        STAKE_CONTRACT_ADDRESSES,
                                        stakeAmount
                                    );
                                    await contract.call("stake", [
                                        ethers.utils.parseEther(stakeAmount),
                                    ]);
                                    resetValue();
                                }}
                                onSuccess={() =>
                                    toast({
                                        title: "Stake Successful",
                                        status: "success",
                                        duration: 5000,
                                        isClosable: true,
                                    })
                                }
                            >
                                Stake
                            </Web3Button>
                        </Stack>
                        <Stack spacing={6} justifyContent="center">
                            <Input
                                type="number"
                                value={unstakeAmount}
                                onChange={(e) => setUnstakeAmount(e.target.value)}
                            />
                            {/* Botón para establecer el monto máximo */}
                            <button onClick={setMaxUnstakeAmount}>Max</button>
                            <Web3Button
                                style={{
                                    background: "linear-gradient(to top, #FF914D, #FF914D)",
                                }}
                                contractAddress={STAKE_CONTRACT_ADDRESSES}
                                action={async (contract) => {
                                    await contract.call("withdrawWithFee", [
                                        ethers.utils.parseEther(unstakeAmount),
                                    ]);
                                    resetValue();
                                }}
                                onSuccess={() =>
                                    toast({
                                        title: "Unstake Successful",
                                        status: "success",
                                        duration: 5000,
                                        isClosable: true,
                                    })
                                }
                            >
                                Unstake
                            </Web3Button>
                        </Stack>
                    </SimpleGrid>
                </Card>
                <Card  p={5} m={5}>
                    <Flex
                        h={"100%"}
                        justifyContent={"space-between"}
                        direction={"column"}
                        textAlign={"center"}
                    >
                        <Text fontSize={"xl"} fontWeight={"bold"}>
                            Accumulated FlowFarm
                        </Text>
                        <Skeleton isLoaded={Boolean(stakeInfo && stakeInfo[1])}>
                            <Box>
                                <Text fontSize={"ms"} fontWeight={"small"}>
                                    {stakeInfo && stakeInfo[1]
                                        ? ethers.utils.formatEther(stakeInfo[1])
                                        : "0"}
                                </Text>
                                <Text>{" $" + rewardTokenBalance?.symbol}</Text>
                            </Box>
                        </Skeleton>
                        <Web3Button
                            style={{
                                background: "linear-gradient(to top, #FF914D, #FF914D)",
                            }}
                            contractAddress={STAKE_CONTRACT_ADDRESSES}
                            action={async (contract) => {
                                await contract.call("claimRewards");
                                resetValue();
                            }}
                            onSuccess={() =>
                                toast({
                                    title: "Rewards Claimed",
                                    status: "success",
                                    duration: 5000,
                                    isClosable: true,
                                })
                            }
                        >
                            Claim
                        </Web3Button>
                    </Flex>
                </Card>
            </SimpleGrid>
        </Card>
    );
    }
