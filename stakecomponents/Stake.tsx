//     import {
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
//     } from "@chakra-ui/react";
//     import {
//     Web3Button,
//     useAddress,
//     useContract,
//     useContractRead,
//     useTokenBalance,
//     } from "@thirdweb-dev/react";
//     import {
//     REWARD_TOKEN_ADDRESSES,
//     STAKE_CONTRACT_ADDRESSES,
//     STAKE_TOKEN_ADDRESSES,
//     } from "../erc20/addresses";
//     import React, { useEffect, useState } from "react";
//     import { ethers } from "ethers";

//     export default function Stake() {
//     const address = useAddress();

// useEffect(() => {
//     if (!address) {
//         // Limpia cualquier estado o efecto secundario aquí
//         resetValue();
//         // Puedes agregar registros de depuración para ayudarte a entender el flujo
//         console.log("Billetera desconectada");
//     }
// }, [address]);


//     const { contract: stakeTokenContract } = useContract(STAKE_TOKEN_ADDRESSES, "token");
//     const { contract: rewardTokenContract } = useContract(REWARD_TOKEN_ADDRESSES, "token");
//     const { contract: stakeContract } = useContract(STAKE_CONTRACT_ADDRESSES, "custom");

//     const { data: stakeInfo, refetch: refetchStakeInfo } = useContractRead(stakeContract, "getStakeInfo", [address]);
//     const { data: stakeTokenBalance } = useTokenBalance(stakeTokenContract, address);
//     const { data: rewardTokenBalance } = useTokenBalance(rewardTokenContract, address);

//     useEffect(() => {
//         setInterval(() => {
//             refetchStakeInfo();
//         }, 10000);
//     }, []);

//     const [stakeAmount, setStakeAmount] = useState<string>("0");
//     const [unstakeAmount, setUnstakeAmount] = useState<string>("0");

//     function resetValue() {
//         setStakeAmount("0");
//         setUnstakeAmount("0");
//     }

//     function setMaxUnstakeAmount() {
//         if (stakeInfo && stakeInfo[0]) {
//             setUnstakeAmount(ethers.utils.formatEther(stakeInfo[0]));
//         }
//     }

//     const toast = useToast();
//     const fontSize = useBreakpointValue({ base: "sm", md: "large" });
//     const cardMargin = useBreakpointValue({ base: { base: 2, md: 5 } });

//     return (
//         <Card className="bg-gradient-to-t from-orange-500 to-gray-300" p={5} mt={10}>
//             <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
//                 <Card  p={5} m={cardMargin}>
//                     <Box textAlign={"center"} mb={5}>
//                         <Text fontSize={"xl"} fontWeight={"bold"}>
//                             Tokens in Staking
//                         </Text>
//                         <Skeleton isLoaded={Boolean(stakeInfo && stakeInfo[0])}>
//                             <Text>
//                                 {stakeInfo && stakeInfo[0]
//                                     ? ethers.utils.formatEther(stakeInfo[0])
//                                     : "0"}
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
//                                     await stakeTokenContract?.erc20.setAllowance(
//                                         STAKE_CONTRACT_ADDRESSES,
//                                         stakeAmount
//                                     );
//                                     await contract.call("stake", [
//                                         ethers.utils.parseEther(stakeAmount),
//                                     ]);
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
//                                 value={unstakeAmount}
//                                 onChange={(e) => setUnstakeAmount(e.target.value)}
//                             />
//                             {/* Botón para establecer el monto máximo */}
//                             <button onClick={setMaxUnstakeAmount}>Max</button>
//                             <Web3Button
//                                 style={{
//                                     background: "linear-gradient(to top, #FF914D, #FF914D)",
//                                 }}
//                                 contractAddress={STAKE_CONTRACT_ADDRESSES}
//                                 action={async (contract) => {
//                                     await contract.call("withdrawWithFee", [
//                                         ethers.utils.parseEther(unstakeAmount),
//                                     ]);
//                                     resetValue();
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
//                 <Card  p={5} m={5}>
//                     <Flex
//                         h={"100%"}
//                         justifyContent={"space-between"}
//                         direction={"column"}
//                         textAlign={"center"}
//                     >
//                         <Text fontSize={"xl"} fontWeight={"bold"}>
//                             Accumulated FlowFarm
//                         </Text>
//                         <Skeleton isLoaded={Boolean(stakeInfo && stakeInfo[1])}>
//                             <Box>
//                                 <Text fontSize={"ms"} fontWeight={"small"}>
//                                     {stakeInfo && stakeInfo[1]
//                                         ? ethers.utils.formatEther(stakeInfo[1])
//                                         : "0"}
//                                 </Text>
//                                 <Text>{" $" + rewardTokenBalance?.symbol}</Text>
//                             </Box>
//                         </Skeleton>
//                         <Web3Button
//                             style={{
//                                 background: "linear-gradient(to top, #FF914D, #FF914D)",
//                             }}
//                             contractAddress={STAKE_CONTRACT_ADDRESSES}
//                             action={async (contract) => {
//                                 await contract.call("claimRewards");
//                                 resetValue();
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
//     }

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
        const interval = setInterval(() => {
            refetchStakeInfo();
        }, 10000);
        return () => {
            clearInterval(interval);
        }
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
 // 1. Obtener el ratio de recompensa
 const { data: rewardRatio } = useContractRead(stakeContract, "getRewardRatio", []);
 console.log("Reward Ratio:", rewardRatio);
 
 // Define las variables fuera del bloque
 let rewardNumerator = 0;
 let rewardDenominator = 0;
 
 // Verifica que rewardRatio esté definido antes de acceder a sus propiedades
 if (rewardRatio) {
     rewardNumerator = parseFloat(ethers.utils.formatEther(rewardRatio._numerator));
     rewardDenominator = parseFloat(ethers.utils.formatEther(rewardRatio._denominator));
     console.log("Reward Numerator:", rewardNumerator);
     console.log("Reward Denominator:", rewardDenominator);
 }
 

 // ... resto del código ...
 

// 3. Obtener el total de tokens en staking
const { data: totalStaked } = useContractRead(stakeContract, "stakingTokenBalance", []);

// Asegurarte de que totalStaked esté definido antes de formatearlo
const totalStakedFloat = totalStaked ? parseFloat(ethers.utils.formatEther(totalStaked)) : 0;
console.log("Total Staked:", totalStakedFloat);


// 4. Obtener la cantidad de tokens que el usuario tiene en staking
const userStake = stakeInfo && stakeInfo.length > 0 ? parseFloat(ethers.utils.formatEther(stakeInfo[0])) : 0;
console.log("User Stake:", userStake);

// 5. Calcular la proporción de tokens del usuario en relación al total
const userStakeProportion = totalStakedFloat ? userStake / totalStakedFloat : 0;
console.log("User Stake Proportion:", userStakeProportion);

// 6. Calcular la recompensa diaria total y la recompensa diaria del usuario
const dailyReward = (rewardNumerator / rewardDenominator) * totalStakedFloat;
const dailyRewardForUser = dailyReward * userStakeProportion;
console.log("Daily Reward:", dailyReward);
console.log("Daily Reward for User:", dailyRewardForUser);

// 7. Calcular el APR individual basado en la recompensa diaria del usuario
const individualAPR = userStake ? (dailyRewardForUser * 365 / userStake) * 100 : 0;
console.log("Individual APR:", individualAPR);

const dailyRewardPercentage = (dailyRewardForUser / userStake) * 100;
const roundedStakeProportion = Math.round(userStakeProportion * 1e6) / 1e6;



 
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
                            Accumulated 
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
                    

                    <Text>
                    User Stake Proportion: {roundedStakeProportion}
                    </Text>

                    </Flex>
                </Card>
            </SimpleGrid>
        </Card>
    );
    }

