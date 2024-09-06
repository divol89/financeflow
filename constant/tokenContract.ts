// This function will be used to get the source code

// This function will be used to get the source code
export async function getTokenSourceCode() {
  const response = await fetch("/api/getContractSource");
  const data = await response.json();
  return data.sourceCode;
}

export const TOKEN_ABI = [
  {
    inputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "symbol",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "initialSupply",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "allowance",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "needed",
        type: "uint256",
      },
    ],
    name: "ERC20InsufficientAllowance",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "balance",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "needed",
        type: "uint256",
      },
    ],
    name: "ERC20InsufficientBalance",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "approver",
        type: "address",
      },
    ],
    name: "ERC20InvalidApprover",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "receiver",
        type: "address",
      },
    ],
    name: "ERC20InvalidReceiver",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "ERC20InvalidSender",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "ERC20InvalidSpender",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "OwnableInvalidOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "OwnableUnauthorizedAccount",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "burn",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
export const TOKEN_BYTECODE = {
  functionDebugData: {
    "@_336": {
      entryPoint: null,
      id: 336,
      parameterSlots: 2,
      returnSlots: 0,
    },
    "@_50": {
      entryPoint: null,
      id: 50,
      parameterSlots: 1,
      returnSlots: 0,
    },
    "@_970": {
      entryPoint: null,
      id: 970,
      parameterSlots: 3,
      returnSlots: 0,
    },
    "@_mint_639": {
      entryPoint: 272,
      id: 639,
      parameterSlots: 2,
      returnSlots: 0,
    },
    "@_transferOwnership_146": {
      entryPoint: 191,
      id: 146,
      parameterSlots: 1,
      returnSlots: 0,
    },
    "@_update_606": {
      entryPoint: 332,
      id: 606,
      parameterSlots: 3,
      returnSlots: 0,
    },
    "@decimals_363": {
      entryPoint: null,
      id: 363,
      parameterSlots: 0,
      returnSlots: 1,
    },
    abi_decode_string_fromMemory: {
      entryPoint: 655,
      id: null,
      parameterSlots: 2,
      returnSlots: 1,
    },
    abi_decode_tuple_t_string_memory_ptrt_string_memory_ptrt_uint256_fromMemory:
      {
        entryPoint: 825,
        id: null,
        parameterSlots: 2,
        returnSlots: 3,
      },
    abi_encode_tuple_t_address__to_t_address__fromStack_reversed: {
      entryPoint: null,
      id: null,
      parameterSlots: 2,
      returnSlots: 1,
    },
    abi_encode_tuple_t_address_t_uint256_t_uint256__to_t_address_t_uint256_t_uint256__fromStack_reversed:
      {
        entryPoint: null,
        id: null,
        parameterSlots: 4,
        returnSlots: 1,
      },
    abi_encode_tuple_t_uint256__to_t_uint256__fromStack_reversed: {
      entryPoint: null,
      id: null,
      parameterSlots: 2,
      returnSlots: 1,
    },
    array_dataslot_string_storage: {
      entryPoint: null,
      id: null,
      parameterSlots: 1,
      returnSlots: 1,
    },
    checked_add_t_uint256: {
      entryPoint: 1595,
      id: null,
      parameterSlots: 2,
      returnSlots: 1,
    },
    checked_exp_helper: {
      entryPoint: 1295,
      id: null,
      parameterSlots: 2,
      returnSlots: 2,
    },
    checked_exp_t_uint256_t_uint8: {
      entryPoint: 1546,
      id: null,
      parameterSlots: 2,
      returnSlots: 1,
    },
    checked_exp_unsigned: {
      entryPoint: 1367,
      id: null,
      parameterSlots: 2,
      returnSlots: 1,
    },
    checked_mul_t_uint256: {
      entryPoint: 1569,
      id: null,
      parameterSlots: 2,
      returnSlots: 1,
    },
    clean_up_bytearray_end_slots_string_storage: {
      entryPoint: 993,
      id: null,
      parameterSlots: 3,
      returnSlots: 0,
    },
    copy_byte_array_to_storage_from_t_string_memory_ptr_to_t_string_storage: {
      entryPoint: 1075,
      id: null,
      parameterSlots: 2,
      returnSlots: 0,
    },
    extract_byte_array_length: {
      entryPoint: 935,
      id: null,
      parameterSlots: 1,
      returnSlots: 1,
    },
    extract_used_part_and_set_length_of_short_byte_array: {
      entryPoint: null,
      id: null,
      parameterSlots: 2,
      returnSlots: 1,
    },
    panic_error_0x11: {
      entryPoint: 1275,
      id: null,
      parameterSlots: 0,
      returnSlots: 0,
    },
    panic_error_0x41: {
      entryPoint: 635,
      id: null,
      parameterSlots: 0,
      returnSlots: 0,
    },
  },
  generatedSources: [
    {
      ast: {
        nodeType: "YulBlock",
        src: "0:6763:7",
        statements: [
          {
            nodeType: "YulBlock",
            src: "6:3:7",
            statements: [],
          },
          {
            body: {
              nodeType: "YulBlock",
              src: "46:95:7",
              statements: [
                {
                  expression: {
                    arguments: [
                      {
                        kind: "number",
                        nodeType: "YulLiteral",
                        src: "63:1:7",
                        type: "",
                        value: "0",
                      },
                      {
                        arguments: [
                          {
                            kind: "number",
                            nodeType: "YulLiteral",
                            src: "70:3:7",
                            type: "",
                            value: "224",
                          },
                          {
                            kind: "number",
                            nodeType: "YulLiteral",
                            src: "75:10:7",
                            type: "",
                            value: "0x4e487b71",
                          },
                        ],
                        functionName: {
                          name: "shl",
                          nodeType: "YulIdentifier",
                          src: "66:3:7",
                        },
                        nodeType: "YulFunctionCall",
                        src: "66:20:7",
                      },
                    ],
                    functionName: {
                      name: "mstore",
                      nodeType: "YulIdentifier",
                      src: "56:6:7",
                    },
                    nodeType: "YulFunctionCall",
                    src: "56:31:7",
                  },
                  nodeType: "YulExpressionStatement",
                  src: "56:31:7",
                },
                {
                  expression: {
                    arguments: [
                      {
                        kind: "number",
                        nodeType: "YulLiteral",
                        src: "103:1:7",
                        type: "",
                        value: "4",
                      },
                      {
                        kind: "number",
                        nodeType: "YulLiteral",
                        src: "106:4:7",
                        type: "",
                        value: "0x41",
                      },
                    ],
                    functionName: {
                      name: "mstore",
                      nodeType: "YulIdentifier",
                      src: "96:6:7",
                    },
                    nodeType: "YulFunctionCall",
                    src: "96:15:7",
                  },
                  nodeType: "YulExpressionStatement",
                  src: "96:15:7",
                },
                {
                  expression: {
                    arguments: [
                      {
                        kind: "number",
                        nodeType: "YulLiteral",
                        src: "127:1:7",
                        type: "",
                        value: "0",
                      },
                      {
                        kind: "number",
                        nodeType: "YulLiteral",
                        src: "130:4:7",
                        type: "",
                        value: "0x24",
                      },
                    ],
                    functionName: {
                      name: "revert",
                      nodeType: "YulIdentifier",
                      src: "120:6:7",
                    },
                    nodeType: "YulFunctionCall",
                    src: "120:15:7",
                  },
                  nodeType: "YulExpressionStatement",
                  src: "120:15:7",
                },
              ],
            },
            name: "panic_error_0x41",
            nodeType: "YulFunctionDefinition",
            src: "14:127:7",
          },
          {
            body: {
              nodeType: "YulBlock",
              src: "210:776:7",
              statements: [
                {
                  body: {
                    nodeType: "YulBlock",
                    src: "259:16:7",
                    statements: [
                      {
                        expression: {
                          arguments: [
                            {
                              kind: "number",
                              nodeType: "YulLiteral",
                              src: "268:1:7",
                              type: "",
                              value: "0",
                            },
                            {
                              kind: "number",
                              nodeType: "YulLiteral",
                              src: "271:1:7",
                              type: "",
                              value: "0",
                            },
                          ],
                          functionName: {
                            name: "revert",
                            nodeType: "YulIdentifier",
                            src: "261:6:7",
                          },
                          nodeType: "YulFunctionCall",
                          src: "261:12:7",
                        },
                        nodeType: "YulExpressionStatement",
                        src: "261:12:7",
                      },
                    ],
                  },
                  condition: {
                    arguments: [
                      {
                        arguments: [
                          {
                            arguments: [
                              {
                                name: "offset",
                                nodeType: "YulIdentifier",
                                src: "238:6:7",
                              },
                              {
                                kind: "number",
                                nodeType: "YulLiteral",
                                src: "246:4:7",
                                type: "",
                                value: "0x1f",
                              },
                            ],
                            functionName: {
                              name: "add",
                              nodeType: "YulIdentifier",
                              src: "234:3:7",
                            },
                            nodeType: "YulFunctionCall",
                            src: "234:17:7",
                          },
                          {
                            name: "end",
                            nodeType: "YulIdentifier",
                            src: "253:3:7",
                          },
                        ],
                        functionName: {
                          name: "slt",
                          nodeType: "YulIdentifier",
                          src: "230:3:7",
                        },
                        nodeType: "YulFunctionCall",
                        src: "230:27:7",
                      },
                    ],
                    functionName: {
                      name: "iszero",
                      nodeType: "YulIdentifier",
                      src: "223:6:7",
                    },
                    nodeType: "YulFunctionCall",
                    src: "223:35:7",
                  },
                  nodeType: "YulIf",
                  src: "220:55:7",
                },
                {
                  nodeType: "YulVariableDeclaration",
                  src: "284:23:7",
                  value: {
                    arguments: [
                      {
                        name: "offset",
                        nodeType: "YulIdentifier",
                        src: "300:6:7",
                      },
                    ],
                    functionName: {
                      name: "mload",
                      nodeType: "YulIdentifier",
                      src: "294:5:7",
                    },
                    nodeType: "YulFunctionCall",
                    src: "294:13:7",
                  },
                  variables: [
                    {
                      name: "_1",
                      nodeType: "YulTypedName",
                      src: "288:2:7",
                      type: "",
                    },
                  ],
                },
                {
                  nodeType: "YulVariableDeclaration",
                  src: "316:28:7",
                  value: {
                    arguments: [
                      {
                        arguments: [
                          {
                            kind: "number",
                            nodeType: "YulLiteral",
                            src: "334:2:7",
                            type: "",
                            value: "64",
                          },
                          {
                            kind: "number",
                            nodeType: "YulLiteral",
                            src: "338:1:7",
                            type: "",
                            value: "1",
                          },
                        ],
                        functionName: {
                          name: "shl",
                          nodeType: "YulIdentifier",
                          src: "330:3:7",
                        },
                        nodeType: "YulFunctionCall",
                        src: "330:10:7",
                      },
                      {
                        kind: "number",
                        nodeType: "YulLiteral",
                        src: "342:1:7",
                        type: "",
                        value: "1",
                      },
                    ],
                    functionName: {
                      name: "sub",
                      nodeType: "YulIdentifier",
                      src: "326:3:7",
                    },
                    nodeType: "YulFunctionCall",
                    src: "326:18:7",
                  },
                  variables: [
                    {
                      name: "_2",
                      nodeType: "YulTypedName",
                      src: "320:2:7",
                      type: "",
                    },
                  ],
                },
                {
                  body: {
                    nodeType: "YulBlock",
                    src: "367:22:7",
                    statements: [
                      {
                        expression: {
                          arguments: [],
                          functionName: {
                            name: "panic_error_0x41",
                            nodeType: "YulIdentifier",
                            src: "369:16:7",
                          },
                          nodeType: "YulFunctionCall",
                          src: "369:18:7",
                        },
                        nodeType: "YulExpressionStatement",
                        src: "369:18:7",
                      },
                    ],
                  },
                  condition: {
                    arguments: [
                      {
                        name: "_1",
                        nodeType: "YulIdentifier",
                        src: "359:2:7",
                      },
                      {
                        name: "_2",
                        nodeType: "YulIdentifier",
                        src: "363:2:7",
                      },
                    ],
                    functionName: {
                      name: "gt",
                      nodeType: "YulIdentifier",
                      src: "356:2:7",
                    },
                    nodeType: "YulFunctionCall",
                    src: "356:10:7",
                  },
                  nodeType: "YulIf",
                  src: "353:36:7",
                },
                {
                  nodeType: "YulVariableDeclaration",
                  src: "398:17:7",
                  value: {
                    arguments: [
                      {
                        kind: "number",
                        nodeType: "YulLiteral",
                        src: "412:2:7",
                        type: "",
                        value: "31",
                      },
                    ],
                    functionName: {
                      name: "not",
                      nodeType: "YulIdentifier",
                      src: "408:3:7",
                    },
                    nodeType: "YulFunctionCall",
                    src: "408:7:7",
                  },
                  variables: [
                    {
                      name: "_3",
                      nodeType: "YulTypedName",
                      src: "402:2:7",
                      type: "",
                    },
                  ],
                },
                {
                  nodeType: "YulVariableDeclaration",
                  src: "424:23:7",
                  value: {
                    arguments: [
                      {
                        kind: "number",
                        nodeType: "YulLiteral",
                        src: "444:2:7",
                        type: "",
                        value: "64",
                      },
                    ],
                    functionName: {
                      name: "mload",
                      nodeType: "YulIdentifier",
                      src: "438:5:7",
                    },
                    nodeType: "YulFunctionCall",
                    src: "438:9:7",
                  },
                  variables: [
                    {
                      name: "memPtr",
                      nodeType: "YulTypedName",
                      src: "428:6:7",
                      type: "",
                    },
                  ],
                },
                {
                  nodeType: "YulVariableDeclaration",
                  src: "456:71:7",
                  value: {
                    arguments: [
                      {
                        name: "memPtr",
                        nodeType: "YulIdentifier",
                        src: "478:6:7",
                      },
                      {
                        arguments: [
                          {
                            arguments: [
                              {
                                arguments: [
                                  {
                                    arguments: [
                                      {
                                        name: "_1",
                                        nodeType: "YulIdentifier",
                                        src: "502:2:7",
                                      },
                                      {
                                        kind: "number",
                                        nodeType: "YulLiteral",
                                        src: "506:4:7",
                                        type: "",
                                        value: "0x1f",
                                      },
                                    ],
                                    functionName: {
                                      name: "add",
                                      nodeType: "YulIdentifier",
                                      src: "498:3:7",
                                    },
                                    nodeType: "YulFunctionCall",
                                    src: "498:13:7",
                                  },
                                  {
                                    name: "_3",
                                    nodeType: "YulIdentifier",
                                    src: "513:2:7",
                                  },
                                ],
                                functionName: {
                                  name: "and",
                                  nodeType: "YulIdentifier",
                                  src: "494:3:7",
                                },
                                nodeType: "YulFunctionCall",
                                src: "494:22:7",
                              },
                              {
                                kind: "number",
                                nodeType: "YulLiteral",
                                src: "518:2:7",
                                type: "",
                                value: "63",
                              },
                            ],
                            functionName: {
                              name: "add",
                              nodeType: "YulIdentifier",
                              src: "490:3:7",
                            },
                            nodeType: "YulFunctionCall",
                            src: "490:31:7",
                          },
                          {
                            name: "_3",
                            nodeType: "YulIdentifier",
                            src: "523:2:7",
                          },
                        ],
                        functionName: {
                          name: "and",
                          nodeType: "YulIdentifier",
                          src: "486:3:7",
                        },
                        nodeType: "YulFunctionCall",
                        src: "486:40:7",
                      },
                    ],
                    functionName: {
                      name: "add",
                      nodeType: "YulIdentifier",
                      src: "474:3:7",
                    },
                    nodeType: "YulFunctionCall",
                    src: "474:53:7",
                  },
                  variables: [
                    {
                      name: "newFreePtr",
                      nodeType: "YulTypedName",
                      src: "460:10:7",
                      type: "",
                    },
                  ],
                },
                {
                  body: {
                    nodeType: "YulBlock",
                    src: "586:22:7",
                    statements: [
                      {
                        expression: {
                          arguments: [],
                          functionName: {
                            name: "panic_error_0x41",
                            nodeType: "YulIdentifier",
                            src: "588:16:7",
                          },
                          nodeType: "YulFunctionCall",
                          src: "588:18:7",
                        },
                        nodeType: "YulExpressionStatement",
                        src: "588:18:7",
                      },
                    ],
                  },
                  condition: {
                    arguments: [
                      {
                        arguments: [
                          {
                            name: "newFreePtr",
                            nodeType: "YulIdentifier",
                            src: "545:10:7",
                          },
                          {
                            name: "_2",
                            nodeType: "YulIdentifier",
                            src: "557:2:7",
                          },
                        ],
                        functionName: {
                          name: "gt",
                          nodeType: "YulIdentifier",
                          src: "542:2:7",
                        },
                        nodeType: "YulFunctionCall",
                        src: "542:18:7",
                      },
                      {
                        arguments: [
                          {
                            name: "newFreePtr",
                            nodeType: "YulIdentifier",
                            src: "565:10:7",
                          },
                          {
                            name: "memPtr",
                            nodeType: "YulIdentifier",
                            src: "577:6:7",
                          },
                        ],
                        functionName: {
                          name: "lt",
                          nodeType: "YulIdentifier",
                          src: "562:2:7",
                        },
                        nodeType: "YulFunctionCall",
                        src: "562:22:7",
                      },
                    ],
                    functionName: {
                      name: "or",
                      nodeType: "YulIdentifier",
                      src: "539:2:7",
                    },
                    nodeType: "YulFunctionCall",
                    src: "539:46:7",
                  },
                  nodeType: "YulIf",
                  src: "536:72:7",
                },
                {
                  expression: {
                    arguments: [
                      {
                        kind: "number",
                        nodeType: "YulLiteral",
                        src: "624:2:7",
                        type: "",
                        value: "64",
                      },
                      {
                        name: "newFreePtr",
                        nodeType: "YulIdentifier",
                        src: "628:10:7",
                      },
                    ],
                    functionName: {
                      name: "mstore",
                      nodeType: "YulIdentifier",
                      src: "617:6:7",
                    },
                    nodeType: "YulFunctionCall",
                    src: "617:22:7",
                  },
                  nodeType: "YulExpressionStatement",
                  src: "617:22:7",
                },
                {
                  expression: {
                    arguments: [
                      {
                        name: "memPtr",
                        nodeType: "YulIdentifier",
                        src: "655:6:7",
                      },
                      {
                        name: "_1",
                        nodeType: "YulIdentifier",
                        src: "663:2:7",
                      },
                    ],
                    functionName: {
                      name: "mstore",
                      nodeType: "YulIdentifier",
                      src: "648:6:7",
                    },
                    nodeType: "YulFunctionCall",
                    src: "648:18:7",
                  },
                  nodeType: "YulExpressionStatement",
                  src: "648:18:7",
                },
                {
                  nodeType: "YulVariableDeclaration",
                  src: "675:14:7",
                  value: {
                    kind: "number",
                    nodeType: "YulLiteral",
                    src: "685:4:7",
                    type: "",
                    value: "0x20",
                  },
                  variables: [
                    {
                      name: "_4",
                      nodeType: "YulTypedName",
                      src: "679:2:7",
                      type: "",
                    },
                  ],
                },
                {
                  body: {
                    nodeType: "YulBlock",
                    src: "735:16:7",
                    statements: [
                      {
                        expression: {
                          arguments: [
                            {
                              kind: "number",
                              nodeType: "YulLiteral",
                              src: "744:1:7",
                              type: "",
                              value: "0",
                            },
                            {
                              kind: "number",
                              nodeType: "YulLiteral",
                              src: "747:1:7",
                              type: "",
                              value: "0",
                            },
                          ],
                          functionName: {
                            name: "revert",
                            nodeType: "YulIdentifier",
                            src: "737:6:7",
                          },
                          nodeType: "YulFunctionCall",
                          src: "737:12:7",
                        },
                        nodeType: "YulExpressionStatement",
                        src: "737:12:7",
                      },
                    ],
                  },
                  condition: {
                    arguments: [
                      {
                        arguments: [
                          {
                            arguments: [
                              {
                                name: "offset",
                                nodeType: "YulIdentifier",
                                src: "712:6:7",
                              },
                              {
                                name: "_1",
                                nodeType: "YulIdentifier",
                                src: "720:2:7",
                              },
                            ],
                            functionName: {
                              name: "add",
                              nodeType: "YulIdentifier",
                              src: "708:3:7",
                            },
                            nodeType: "YulFunctionCall",
                            src: "708:15:7",
                          },
                          {
                            name: "_4",
                            nodeType: "YulIdentifier",
                            src: "725:2:7",
                          },
                        ],
                        functionName: {
                          name: "add",
                          nodeType: "YulIdentifier",
                          src: "704:3:7",
                        },
                        nodeType: "YulFunctionCall",
                        src: "704:24:7",
                      },
                      {
                        name: "end",
                        nodeType: "YulIdentifier",
                        src: "730:3:7",
                      },
                    ],
                    functionName: {
                      name: "gt",
                      nodeType: "YulIdentifier",
                      src: "701:2:7",
                    },
                    nodeType: "YulFunctionCall",
                    src: "701:33:7",
                  },
                  nodeType: "YulIf",
                  src: "698:53:7",
                },
                {
                  nodeType: "YulVariableDeclaration",
                  src: "760:10:7",
                  value: {
                    kind: "number",
                    nodeType: "YulLiteral",
                    src: "769:1:7",
                    type: "",
                    value: "0",
                  },
                  variables: [
                    {
                      name: "i",
                      nodeType: "YulTypedName",
                      src: "764:1:7",
                      type: "",
                    },
                  ],
                },
                {
                  body: {
                    nodeType: "YulBlock",
                    src: "825:87:7",
                    statements: [
                      {
                        expression: {
                          arguments: [
                            {
                              arguments: [
                                {
                                  arguments: [
                                    {
                                      name: "memPtr",
                                      nodeType: "YulIdentifier",
                                      src: "854:6:7",
                                    },
                                    {
                                      name: "i",
                                      nodeType: "YulIdentifier",
                                      src: "862:1:7",
                                    },
                                  ],
                                  functionName: {
                                    name: "add",
                                    nodeType: "YulIdentifier",
                                    src: "850:3:7",
                                  },
                                  nodeType: "YulFunctionCall",
                                  src: "850:14:7",
                                },
                                {
                                  name: "_4",
                                  nodeType: "YulIdentifier",
                                  src: "866:2:7",
                                },
                              ],
                              functionName: {
                                name: "add",
                                nodeType: "YulIdentifier",
                                src: "846:3:7",
                              },
                              nodeType: "YulFunctionCall",
                              src: "846:23:7",
                            },
                            {
                              arguments: [
                                {
                                  arguments: [
                                    {
                                      arguments: [
                                        {
                                          name: "offset",
                                          nodeType: "YulIdentifier",
                                          src: "885:6:7",
                                        },
                                        {
                                          name: "i",
                                          nodeType: "YulIdentifier",
                                          src: "893:1:7",
                                        },
                                      ],
                                      functionName: {
                                        name: "add",
                                        nodeType: "YulIdentifier",
                                        src: "881:3:7",
                                      },
                                      nodeType: "YulFunctionCall",
                                      src: "881:14:7",
                                    },
                                    {
                                      name: "_4",
                                      nodeType: "YulIdentifier",
                                      src: "897:2:7",
                                    },
                                  ],
                                  functionName: {
                                    name: "add",
                                    nodeType: "YulIdentifier",
                                    src: "877:3:7",
                                  },
                                  nodeType: "YulFunctionCall",
                                  src: "877:23:7",
                                },
                              ],
                              functionName: {
                                name: "mload",
                                nodeType: "YulIdentifier",
                                src: "871:5:7",
                              },
                              nodeType: "YulFunctionCall",
                              src: "871:30:7",
                            },
                          ],
                          functionName: {
                            name: "mstore",
                            nodeType: "YulIdentifier",
                            src: "839:6:7",
                          },
                          nodeType: "YulFunctionCall",
                          src: "839:63:7",
                        },
                        nodeType: "YulExpressionStatement",
                        src: "839:63:7",
                      },
                    ],
                  },
                  condition: {
                    arguments: [
                      {
                        name: "i",
                        nodeType: "YulIdentifier",
                        src: "790:1:7",
                      },
                      {
                        name: "_1",
                        nodeType: "YulIdentifier",
                        src: "793:2:7",
                      },
                    ],
                    functionName: {
                      name: "lt",
                      nodeType: "YulIdentifier",
                      src: "787:2:7",
                    },
                    nodeType: "YulFunctionCall",
                    src: "787:9:7",
                  },
                  nodeType: "YulForLoop",
                  post: {
                    nodeType: "YulBlock",
                    src: "797:19:7",
                    statements: [
                      {
                        nodeType: "YulAssignment",
                        src: "799:15:7",
                        value: {
                          arguments: [
                            {
                              name: "i",
                              nodeType: "YulIdentifier",
                              src: "808:1:7",
                            },
                            {
                              name: "_4",
                              nodeType: "YulIdentifier",
                              src: "811:2:7",
                            },
                          ],
                          functionName: {
                            name: "add",
                            nodeType: "YulIdentifier",
                            src: "804:3:7",
                          },
                          nodeType: "YulFunctionCall",
                          src: "804:10:7",
                        },
                        variableNames: [
                          {
                            name: "i",
                            nodeType: "YulIdentifier",
                            src: "799:1:7",
                          },
                        ],
                      },
                    ],
                  },
                  pre: {
                    nodeType: "YulBlock",
                    src: "783:3:7",
                    statements: [],
                  },
                  src: "779:133:7",
                },
                {
                  expression: {
                    arguments: [
                      {
                        arguments: [
                          {
                            arguments: [
                              {
                                name: "memPtr",
                                nodeType: "YulIdentifier",
                                src: "936:6:7",
                              },
                              {
                                name: "_1",
                                nodeType: "YulIdentifier",
                                src: "944:2:7",
                              },
                            ],
                            functionName: {
                              name: "add",
                              nodeType: "YulIdentifier",
                              src: "932:3:7",
                            },
                            nodeType: "YulFunctionCall",
                            src: "932:15:7",
                          },
                          {
                            name: "_4",
                            nodeType: "YulIdentifier",
                            src: "949:2:7",
                          },
                        ],
                        functionName: {
                          name: "add",
                          nodeType: "YulIdentifier",
                          src: "928:3:7",
                        },
                        nodeType: "YulFunctionCall",
                        src: "928:24:7",
                      },
                      {
                        kind: "number",
                        nodeType: "YulLiteral",
                        src: "954:1:7",
                        type: "",
                        value: "0",
                      },
                    ],
                    functionName: {
                      name: "mstore",
                      nodeType: "YulIdentifier",
                      src: "921:6:7",
                    },
                    nodeType: "YulFunctionCall",
                    src: "921:35:7",
                  },
                  nodeType: "YulExpressionStatement",
                  src: "921:35:7",
                },
                {
                  nodeType: "YulAssignment",
                  src: "965:15:7",
                  value: {
                    name: "memPtr",
                    nodeType: "YulIdentifier",
                    src: "974:6:7",
                  },
                  variableNames: [
                    {
                      name: "array",
                      nodeType: "YulIdentifier",
                      src: "965:5:7",
                    },
                  ],
                },
              ],
            },
            name: "abi_decode_string_fromMemory",
            nodeType: "YulFunctionDefinition",
            parameters: [
              {
                name: "offset",
                nodeType: "YulTypedName",
                src: "184:6:7",
                type: "",
              },
              {
                name: "end",
                nodeType: "YulTypedName",
                src: "192:3:7",
                type: "",
              },
            ],
            returnVariables: [
              {
                name: "array",
                nodeType: "YulTypedName",
                src: "200:5:7",
                type: "",
              },
            ],
            src: "146:840:7",
          },
          {
            body: {
              nodeType: "YulBlock",
              src: "1126:488:7",
              statements: [
                {
                  body: {
                    nodeType: "YulBlock",
                    src: "1172:16:7",
                    statements: [
                      {
                        expression: {
                          arguments: [
                            {
                              kind: "number",
                              nodeType: "YulLiteral",
                              src: "1181:1:7",
                              type: "",
                              value: "0",
                            },
                            {
                              kind: "number",
                              nodeType: "YulLiteral",
                              src: "1184:1:7",
                              type: "",
                              value: "0",
                            },
                          ],
                          functionName: {
                            name: "revert",
                            nodeType: "YulIdentifier",
                            src: "1174:6:7",
                          },
                          nodeType: "YulFunctionCall",
                          src: "1174:12:7",
                        },
                        nodeType: "YulExpressionStatement",
                        src: "1174:12:7",
                      },
                    ],
                  },
                  condition: {
                    arguments: [
                      {
                        arguments: [
                          {
                            name: "dataEnd",
                            nodeType: "YulIdentifier",
                            src: "1147:7:7",
                          },
                          {
                            name: "headStart",
                            nodeType: "YulIdentifier",
                            src: "1156:9:7",
                          },
                        ],
                        functionName: {
                          name: "sub",
                          nodeType: "YulIdentifier",
                          src: "1143:3:7",
                        },
                        nodeType: "YulFunctionCall",
                        src: "1143:23:7",
                      },
                      {
                        kind: "number",
                        nodeType: "YulLiteral",
                        src: "1168:2:7",
                        type: "",
                        value: "96",
                      },
                    ],
                    functionName: {
                      name: "slt",
                      nodeType: "YulIdentifier",
                      src: "1139:3:7",
                    },
                    nodeType: "YulFunctionCall",
                    src: "1139:32:7",
                  },
                  nodeType: "YulIf",
                  src: "1136:52:7",
                },
                {
                  nodeType: "YulVariableDeclaration",
                  src: "1197:30:7",
                  value: {
                    arguments: [
                      {
                        name: "headStart",
                        nodeType: "YulIdentifier",
                        src: "1217:9:7",
                      },
                    ],
                    functionName: {
                      name: "mload",
                      nodeType: "YulIdentifier",
                      src: "1211:5:7",
                    },
                    nodeType: "YulFunctionCall",
                    src: "1211:16:7",
                  },
                  variables: [
                    {
                      name: "offset",
                      nodeType: "YulTypedName",
                      src: "1201:6:7",
                      type: "",
                    },
                  ],
                },
                {
                  nodeType: "YulVariableDeclaration",
                  src: "1236:28:7",
                  value: {
                    arguments: [
                      {
                        arguments: [
                          {
                            kind: "number",
                            nodeType: "YulLiteral",
                            src: "1254:2:7",
                            type: "",
                            value: "64",
                          },
                          {
                            kind: "number",
                            nodeType: "YulLiteral",
                            src: "1258:1:7",
                            type: "",
                            value: "1",
                          },
                        ],
                        functionName: {
                          name: "shl",
                          nodeType: "YulIdentifier",
                          src: "1250:3:7",
                        },
                        nodeType: "YulFunctionCall",
                        src: "1250:10:7",
                      },
                      {
                        kind: "number",
                        nodeType: "YulLiteral",
                        src: "1262:1:7",
                        type: "",
                        value: "1",
                      },
                    ],
                    functionName: {
                      name: "sub",
                      nodeType: "YulIdentifier",
                      src: "1246:3:7",
                    },
                    nodeType: "YulFunctionCall",
                    src: "1246:18:7",
                  },
                  variables: [
                    {
                      name: "_1",
                      nodeType: "YulTypedName",
                      src: "1240:2:7",
                      type: "",
                    },
                  ],
                },
                {
                  body: {
                    nodeType: "YulBlock",
                    src: "1291:16:7",
                    statements: [
                      {
                        expression: {
                          arguments: [
                            {
                              kind: "number",
                              nodeType: "YulLiteral",
                              src: "1300:1:7",
                              type: "",
                              value: "0",
                            },
                            {
                              kind: "number",
                              nodeType: "YulLiteral",
                              src: "1303:1:7",
                              type: "",
                              value: "0",
                            },
                          ],
                          functionName: {
                            name: "revert",
                            nodeType: "YulIdentifier",
                            src: "1293:6:7",
                          },
                          nodeType: "YulFunctionCall",
                          src: "1293:12:7",
                        },
                        nodeType: "YulExpressionStatement",
                        src: "1293:12:7",
                      },
                    ],
                  },
                  condition: {
                    arguments: [
                      {
                        name: "offset",
                        nodeType: "YulIdentifier",
                        src: "1279:6:7",
                      },
                      {
                        name: "_1",
                        nodeType: "YulIdentifier",
                        src: "1287:2:7",
                      },
                    ],
                    functionName: {
                      name: "gt",
                      nodeType: "YulIdentifier",
                      src: "1276:2:7",
                    },
                    nodeType: "YulFunctionCall",
                    src: "1276:14:7",
                  },
                  nodeType: "YulIf",
                  src: "1273:34:7",
                },
                {
                  nodeType: "YulAssignment",
                  src: "1316:71:7",
                  value: {
                    arguments: [
                      {
                        arguments: [
                          {
                            name: "headStart",
                            nodeType: "YulIdentifier",
                            src: "1359:9:7",
                          },
                          {
                            name: "offset",
                            nodeType: "YulIdentifier",
                            src: "1370:6:7",
                          },
                        ],
                        functionName: {
                          name: "add",
                          nodeType: "YulIdentifier",
                          src: "1355:3:7",
                        },
                        nodeType: "YulFunctionCall",
                        src: "1355:22:7",
                      },
                      {
                        name: "dataEnd",
                        nodeType: "YulIdentifier",
                        src: "1379:7:7",
                      },
                    ],
                    functionName: {
                      name: "abi_decode_string_fromMemory",
                      nodeType: "YulIdentifier",
                      src: "1326:28:7",
                    },
                    nodeType: "YulFunctionCall",
                    src: "1326:61:7",
                  },
                  variableNames: [
                    {
                      name: "value0",
                      nodeType: "YulIdentifier",
                      src: "1316:6:7",
                    },
                  ],
                },
                {
                  nodeType: "YulVariableDeclaration",
                  src: "1396:41:7",
                  value: {
                    arguments: [
                      {
                        arguments: [
                          {
                            name: "headStart",
                            nodeType: "YulIdentifier",
                            src: "1422:9:7",
                          },
                          {
                            kind: "number",
                            nodeType: "YulLiteral",
                            src: "1433:2:7",
                            type: "",
                            value: "32",
                          },
                        ],
                        functionName: {
                          name: "add",
                          nodeType: "YulIdentifier",
                          src: "1418:3:7",
                        },
                        nodeType: "YulFunctionCall",
                        src: "1418:18:7",
                      },
                    ],
                    functionName: {
                      name: "mload",
                      nodeType: "YulIdentifier",
                      src: "1412:5:7",
                    },
                    nodeType: "YulFunctionCall",
                    src: "1412:25:7",
                  },
                  variables: [
                    {
                      name: "offset_1",
                      nodeType: "YulTypedName",
                      src: "1400:8:7",
                      type: "",
                    },
                  ],
                },
                {
                  body: {
                    nodeType: "YulBlock",
                    src: "1466:16:7",
                    statements: [
                      {
                        expression: {
                          arguments: [
                            {
                              kind: "number",
                              nodeType: "YulLiteral",
                              src: "1475:1:7",
                              type: "",
                              value: "0",
                            },
                            {
                              kind: "number",
                              nodeType: "YulLiteral",
                              src: "1478:1:7",
                              type: "",
                              value: "0",
                            },
                          ],
                          functionName: {
                            name: "revert",
                            nodeType: "YulIdentifier",
                            src: "1468:6:7",
                          },
                          nodeType: "YulFunctionCall",
                          src: "1468:12:7",
                        },
                        nodeType: "YulExpressionStatement",
                        src: "1468:12:7",
                      },
                    ],
                  },
                  condition: {
                    arguments: [
                      {
                        name: "offset_1",
                        nodeType: "YulIdentifier",
                        src: "1452:8:7",
                      },
                      {
                        name: "_1",
                        nodeType: "YulIdentifier",
                        src: "1462:2:7",
                      },
                    ],
                    functionName: {
                      name: "gt",
                      nodeType: "YulIdentifier",
                      src: "1449:2:7",
                    },
                    nodeType: "YulFunctionCall",
                    src: "1449:16:7",
                  },
                  nodeType: "YulIf",
                  src: "1446:36:7",
                },
                {
                  nodeType: "YulAssignment",
                  src: "1491:73:7",
                  value: {
                    arguments: [
                      {
                        arguments: [
                          {
                            name: "headStart",
                            nodeType: "YulIdentifier",
                            src: "1534:9:7",
                          },
                          {
                            name: "offset_1",
                            nodeType: "YulIdentifier",
                            src: "1545:8:7",
                          },
                        ],
                        functionName: {
                          name: "add",
                          nodeType: "YulIdentifier",
                          src: "1530:3:7",
                        },
                        nodeType: "YulFunctionCall",
                        src: "1530:24:7",
                      },
                      {
                        name: "dataEnd",
                        nodeType: "YulIdentifier",
                        src: "1556:7:7",
                      },
                    ],
                    functionName: {
                      name: "abi_decode_string_fromMemory",
                      nodeType: "YulIdentifier",
                      src: "1501:28:7",
                    },
                    nodeType: "YulFunctionCall",
                    src: "1501:63:7",
                  },
                  variableNames: [
                    {
                      name: "value1",
                      nodeType: "YulIdentifier",
                      src: "1491:6:7",
                    },
                  ],
                },
                {
                  nodeType: "YulAssignment",
                  src: "1573:35:7",
                  value: {
                    arguments: [
                      {
                        arguments: [
                          {
                            name: "headStart",
                            nodeType: "YulIdentifier",
                            src: "1593:9:7",
                          },
                          {
                            kind: "number",
                            nodeType: "YulLiteral",
                            src: "1604:2:7",
                            type: "",
                            value: "64",
                          },
                        ],
                        functionName: {
                          name: "add",
                          nodeType: "YulIdentifier",
                          src: "1589:3:7",
                        },
                        nodeType: "YulFunctionCall",
                        src: "1589:18:7",
                      },
                    ],
                    functionName: {
                      name: "mload",
                      nodeType: "YulIdentifier",
                      src: "1583:5:7",
                    },
                    nodeType: "YulFunctionCall",
                    src: "1583:25:7",
                  },
                  variableNames: [
                    {
                      name: "value2",
                      nodeType: "YulIdentifier",
                      src: "1573:6:7",
                    },
                  ],
                },
              ],
            },
            name: "abi_decode_tuple_t_string_memory_ptrt_string_memory_ptrt_uint256_fromMemory",
            nodeType: "YulFunctionDefinition",
            parameters: [
              {
                name: "headStart",
                nodeType: "YulTypedName",
                src: "1076:9:7",
                type: "",
              },
              {
                name: "dataEnd",
                nodeType: "YulTypedName",
                src: "1087:7:7",
                type: "",
              },
            ],
            returnVariables: [
              {
                name: "value0",
                nodeType: "YulTypedName",
                src: "1099:6:7",
                type: "",
              },
              {
                name: "value1",
                nodeType: "YulTypedName",
                src: "1107:6:7",
                type: "",
              },
              {
                name: "value2",
                nodeType: "YulTypedName",
                src: "1115:6:7",
                type: "",
              },
            ],
            src: "991:623:7",
          },
          {
            body: {
              nodeType: "YulBlock",
              src: "1674:325:7",
              statements: [
                {
                  nodeType: "YulAssignment",
                  src: "1684:22:7",
                  value: {
                    arguments: [
                      {
                        kind: "number",
                        nodeType: "YulLiteral",
                        src: "1698:1:7",
                        type: "",
                        value: "1",
                      },
                      {
                        name: "data",
                        nodeType: "YulIdentifier",
                        src: "1701:4:7",
                      },
                    ],
                    functionName: {
                      name: "shr",
                      nodeType: "YulIdentifier",
                      src: "1694:3:7",
                    },
                    nodeType: "YulFunctionCall",
                    src: "1694:12:7",
                  },
                  variableNames: [
                    {
                      name: "length",
                      nodeType: "YulIdentifier",
                      src: "1684:6:7",
                    },
                  ],
                },
                {
                  nodeType: "YulVariableDeclaration",
                  src: "1715:38:7",
                  value: {
                    arguments: [
                      {
                        name: "data",
                        nodeType: "YulIdentifier",
                        src: "1745:4:7",
                      },
                      {
                        kind: "number",
                        nodeType: "YulLiteral",
                        src: "1751:1:7",
                        type: "",
                        value: "1",
                      },
                    ],
                    functionName: {
                      name: "and",
                      nodeType: "YulIdentifier",
                      src: "1741:3:7",
                    },
                    nodeType: "YulFunctionCall",
                    src: "1741:12:7",
                  },
                  variables: [
                    {
                      name: "outOfPlaceEncoding",
                      nodeType: "YulTypedName",
                      src: "1719:18:7",
                      type: "",
                    },
                  ],
                },
                {
                  body: {
                    nodeType: "YulBlock",
                    src: "1792:31:7",
                    statements: [
                      {
                        nodeType: "YulAssignment",
                        src: "1794:27:7",
                        value: {
                          arguments: [
                            {
                              name: "length",
                              nodeType: "YulIdentifier",
                              src: "1808:6:7",
                            },
                            {
                              kind: "number",
                              nodeType: "YulLiteral",
                              src: "1816:4:7",
                              type: "",
                              value: "0x7f",
                            },
                          ],
                          functionName: {
                            name: "and",
                            nodeType: "YulIdentifier",
                            src: "1804:3:7",
                          },
                          nodeType: "YulFunctionCall",
                          src: "1804:17:7",
                        },
                        variableNames: [
                          {
                            name: "length",
                            nodeType: "YulIdentifier",
                            src: "1794:6:7",
                          },
                        ],
                      },
                    ],
                  },
                  condition: {
                    arguments: [
                      {
                        name: "outOfPlaceEncoding",
                        nodeType: "YulIdentifier",
                        src: "1772:18:7",
                      },
                    ],
                    functionName: {
                      name: "iszero",
                      nodeType: "YulIdentifier",
                      src: "1765:6:7",
                    },
                    nodeType: "YulFunctionCall",
                    src: "1765:26:7",
                  },
                  nodeType: "YulIf",
                  src: "1762:61:7",
                },
                {
                  body: {
                    nodeType: "YulBlock",
                    src: "1882:111:7",
                    statements: [
                      {
                        expression: {
                          arguments: [
                            {
                              kind: "number",
                              nodeType: "YulLiteral",
                              src: "1903:1:7",
                              type: "",
                              value: "0",
                            },
                            {
                              arguments: [
                                {
                                  kind: "number",
                                  nodeType: "YulLiteral",
                                  src: "1910:3:7",
                                  type: "",
                                  value: "224",
                                },
                                {
                                  kind: "number",
                                  nodeType: "YulLiteral",
                                  src: "1915:10:7",
                                  type: "",
                                  value: "0x4e487b71",
                                },
                              ],
                              functionName: {
                                name: "shl",
                                nodeType: "YulIdentifier",
                                src: "1906:3:7",
                              },
                              nodeType: "YulFunctionCall",
                              src: "1906:20:7",
                            },
                          ],
                          functionName: {
                            name: "mstore",
                            nodeType: "YulIdentifier",
                            src: "1896:6:7",
                          },
                          nodeType: "YulFunctionCall",
                          src: "1896:31:7",
                        },
                        nodeType: "YulExpressionStatement",
                        src: "1896:31:7",
                      },
                      {
                        expression: {
                          arguments: [
                            {
                              kind: "number",
                              nodeType: "YulLiteral",
                              src: "1947:1:7",
                              type: "",
                              value: "4",
                            },
                            {
                              kind: "number",
                              nodeType: "YulLiteral",
                              src: "1950:4:7",
                              type: "",
                              value: "0x22",
                            },
                          ],
                          functionName: {
                            name: "mstore",
                            nodeType: "YulIdentifier",
                            src: "1940:6:7",
                          },
                          nodeType: "YulFunctionCall",
                          src: "1940:15:7",
                        },
                        nodeType: "YulExpressionStatement",
                        src: "1940:15:7",
                      },
                      {
                        expression: {
                          arguments: [
                            {
                              kind: "number",
                              nodeType: "YulLiteral",
                              src: "1975:1:7",
                              type: "",
                              value: "0",
                            },
                            {
                              kind: "number",
                              nodeType: "YulLiteral",
                              src: "1978:4:7",
                              type: "",
                              value: "0x24",
                            },
                          ],
                          functionName: {
                            name: "revert",
                            nodeType: "YulIdentifier",
                            src: "1968:6:7",
                          },
                          nodeType: "YulFunctionCall",
                          src: "1968:15:7",
                        },
                        nodeType: "YulExpressionStatement",
                        src: "1968:15:7",
                      },
                    ],
                  },
                  condition: {
                    arguments: [
                      {
                        name: "outOfPlaceEncoding",
                        nodeType: "YulIdentifier",
                        src: "1838:18:7",
                      },
                      {
                        arguments: [
                          {
                            name: "length",
                            nodeType: "YulIdentifier",
                            src: "1861:6:7",
                          },
                          {
                            kind: "number",
                            nodeType: "YulLiteral",
                            src: "1869:2:7",
                            type: "",
                            value: "32",
                          },
                        ],
                        functionName: {
                          name: "lt",
                          nodeType: "YulIdentifier",
                          src: "1858:2:7",
                        },
                        nodeType: "YulFunctionCall",
                        src: "1858:14:7",
                      },
                    ],
                    functionName: {
                      name: "eq",
                      nodeType: "YulIdentifier",
                      src: "1835:2:7",
                    },
                    nodeType: "YulFunctionCall",
                    src: "1835:38:7",
                  },
                  nodeType: "YulIf",
                  src: "1832:161:7",
                },
              ],
            },
            name: "extract_byte_array_length",
            nodeType: "YulFunctionDefinition",
            parameters: [
              {
                name: "data",
                nodeType: "YulTypedName",
                src: "1654:4:7",
                type: "",
              },
            ],
            returnVariables: [
              {
                name: "length",
                nodeType: "YulTypedName",
                src: "1663:6:7",
                type: "",
              },
            ],
            src: "1619:380:7",
          },
          {
            body: {
              nodeType: "YulBlock",
              src: "2060:65:7",
              statements: [
                {
                  expression: {
                    arguments: [
                      {
                        kind: "number",
                        nodeType: "YulLiteral",
                        src: "2077:1:7",
                        type: "",
                        value: "0",
                      },
                      {
                        name: "ptr",
                        nodeType: "YulIdentifier",
                        src: "2080:3:7",
                      },
                    ],
                    functionName: {
                      name: "mstore",
                      nodeType: "YulIdentifier",
                      src: "2070:6:7",
                    },
                    nodeType: "YulFunctionCall",
                    src: "2070:14:7",
                  },
                  nodeType: "YulExpressionStatement",
                  src: "2070:14:7",
                },
                {
                  nodeType: "YulAssignment",
                  src: "2093:26:7",
                  value: {
                    arguments: [
                      {
                        kind: "number",
                        nodeType: "YulLiteral",
                        src: "2111:1:7",
                        type: "",
                        value: "0",
                      },
                      {
                        kind: "number",
                        nodeType: "YulLiteral",
                        src: "2114:4:7",
                        type: "",
                        value: "0x20",
                      },
                    ],
                    functionName: {
                      name: "keccak256",
                      nodeType: "YulIdentifier",
                      src: "2101:9:7",
                    },
                    nodeType: "YulFunctionCall",
                    src: "2101:18:7",
                  },
                  variableNames: [
                    {
                      name: "data",
                      nodeType: "YulIdentifier",
                      src: "2093:4:7",
                    },
                  ],
                },
              ],
            },
            name: "array_dataslot_string_storage",
            nodeType: "YulFunctionDefinition",
            parameters: [
              {
                name: "ptr",
                nodeType: "YulTypedName",
                src: "2043:3:7",
                type: "",
              },
            ],
            returnVariables: [
              {
                name: "data",
                nodeType: "YulTypedName",
                src: "2051:4:7",
                type: "",
              },
            ],
            src: "2004:121:7",
          },
          {
            body: {
              nodeType: "YulBlock",
              src: "2211:464:7",
              statements: [
                {
                  body: {
                    nodeType: "YulBlock",
                    src: "2244:425:7",
                    statements: [
                      {
                        nodeType: "YulVariableDeclaration",
                        src: "2258:11:7",
                        value: {
                          kind: "number",
                          nodeType: "YulLiteral",
                          src: "2268:1:7",
                          type: "",
                          value: "0",
                        },
                        variables: [
                          {
                            name: "_1",
                            nodeType: "YulTypedName",
                            src: "2262:2:7",
                            type: "",
                          },
                        ],
                      },
                      {
                        expression: {
                          arguments: [
                            {
                              name: "_1",
                              nodeType: "YulIdentifier",
                              src: "2289:2:7",
                            },
                            {
                              name: "array",
                              nodeType: "YulIdentifier",
                              src: "2293:5:7",
                            },
                          ],
                          functionName: {
                            name: "mstore",
                            nodeType: "YulIdentifier",
                            src: "2282:6:7",
                          },
                          nodeType: "YulFunctionCall",
                          src: "2282:17:7",
                        },
                        nodeType: "YulExpressionStatement",
                        src: "2282:17:7",
                      },
                      {
                        nodeType: "YulVariableDeclaration",
                        src: "2312:31:7",
                        value: {
                          arguments: [
                            {
                              name: "_1",
                              nodeType: "YulIdentifier",
                              src: "2334:2:7",
                            },
                            {
                              kind: "number",
                              nodeType: "YulLiteral",
                              src: "2338:4:7",
                              type: "",
                              value: "0x20",
                            },
                          ],
                          functionName: {
                            name: "keccak256",
                            nodeType: "YulIdentifier",
                            src: "2324:9:7",
                          },
                          nodeType: "YulFunctionCall",
                          src: "2324:19:7",
                        },
                        variables: [
                          {
                            name: "data",
                            nodeType: "YulTypedName",
                            src: "2316:4:7",
                            type: "",
                          },
                        ],
                      },
                      {
                        nodeType: "YulVariableDeclaration",
                        src: "2356:57:7",
                        value: {
                          arguments: [
                            {
                              name: "data",
                              nodeType: "YulIdentifier",
                              src: "2379:4:7",
                            },
                            {
                              arguments: [
                                {
                                  kind: "number",
                                  nodeType: "YulLiteral",
                                  src: "2389:1:7",
                                  type: "",
                                  value: "5",
                                },
                                {
                                  arguments: [
                                    {
                                      name: "startIndex",
                                      nodeType: "YulIdentifier",
                                      src: "2396:10:7",
                                    },
                                    {
                                      kind: "number",
                                      nodeType: "YulLiteral",
                                      src: "2408:2:7",
                                      type: "",
                                      value: "31",
                                    },
                                  ],
                                  functionName: {
                                    name: "add",
                                    nodeType: "YulIdentifier",
                                    src: "2392:3:7",
                                  },
                                  nodeType: "YulFunctionCall",
                                  src: "2392:19:7",
                                },
                              ],
                              functionName: {
                                name: "shr",
                                nodeType: "YulIdentifier",
                                src: "2385:3:7",
                              },
                              nodeType: "YulFunctionCall",
                              src: "2385:27:7",
                            },
                          ],
                          functionName: {
                            name: "add",
                            nodeType: "YulIdentifier",
                            src: "2375:3:7",
                          },
                          nodeType: "YulFunctionCall",
                          src: "2375:38:7",
                        },
                        variables: [
                          {
                            name: "deleteStart",
                            nodeType: "YulTypedName",
                            src: "2360:11:7",
                            type: "",
                          },
                        ],
                      },
                      {
                        body: {
                          nodeType: "YulBlock",
                          src: "2450:23:7",
                          statements: [
                            {
                              nodeType: "YulAssignment",
                              src: "2452:19:7",
                              value: {
                                name: "data",
                                nodeType: "YulIdentifier",
                                src: "2467:4:7",
                              },
                              variableNames: [
                                {
                                  name: "deleteStart",
                                  nodeType: "YulIdentifier",
                                  src: "2452:11:7",
                                },
                              ],
                            },
                          ],
                        },
                        condition: {
                          arguments: [
                            {
                              name: "startIndex",
                              nodeType: "YulIdentifier",
                              src: "2432:10:7",
                            },
                            {
                              kind: "number",
                              nodeType: "YulLiteral",
                              src: "2444:4:7",
                              type: "",
                              value: "0x20",
                            },
                          ],
                          functionName: {
                            name: "lt",
                            nodeType: "YulIdentifier",
                            src: "2429:2:7",
                          },
                          nodeType: "YulFunctionCall",
                          src: "2429:20:7",
                        },
                        nodeType: "YulIf",
                        src: "2426:47:7",
                      },
                      {
                        nodeType: "YulVariableDeclaration",
                        src: "2486:41:7",
                        value: {
                          arguments: [
                            {
                              name: "data",
                              nodeType: "YulIdentifier",
                              src: "2500:4:7",
                            },
                            {
                              arguments: [
                                {
                                  kind: "number",
                                  nodeType: "YulLiteral",
                                  src: "2510:1:7",
                                  type: "",
                                  value: "5",
                                },
                                {
                                  arguments: [
                                    {
                                      name: "len",
                                      nodeType: "YulIdentifier",
                                      src: "2517:3:7",
                                    },
                                    {
                                      kind: "number",
                                      nodeType: "YulLiteral",
                                      src: "2522:2:7",
                                      type: "",
                                      value: "31",
                                    },
                                  ],
                                  functionName: {
                                    name: "add",
                                    nodeType: "YulIdentifier",
                                    src: "2513:3:7",
                                  },
                                  nodeType: "YulFunctionCall",
                                  src: "2513:12:7",
                                },
                              ],
                              functionName: {
                                name: "shr",
                                nodeType: "YulIdentifier",
                                src: "2506:3:7",
                              },
                              nodeType: "YulFunctionCall",
                              src: "2506:20:7",
                            },
                          ],
                          functionName: {
                            name: "add",
                            nodeType: "YulIdentifier",
                            src: "2496:3:7",
                          },
                          nodeType: "YulFunctionCall",
                          src: "2496:31:7",
                        },
                        variables: [
                          {
                            name: "_2",
                            nodeType: "YulTypedName",
                            src: "2490:2:7",
                            type: "",
                          },
                        ],
                      },
                      {
                        nodeType: "YulVariableDeclaration",
                        src: "2540:24:7",
                        value: {
                          name: "deleteStart",
                          nodeType: "YulIdentifier",
                          src: "2553:11:7",
                        },
                        variables: [
                          {
                            name: "start",
                            nodeType: "YulTypedName",
                            src: "2544:5:7",
                            type: "",
                          },
                        ],
                      },
                      {
                        body: {
                          nodeType: "YulBlock",
                          src: "2638:21:7",
                          statements: [
                            {
                              expression: {
                                arguments: [
                                  {
                                    name: "start",
                                    nodeType: "YulIdentifier",
                                    src: "2647:5:7",
                                  },
                                  {
                                    name: "_1",
                                    nodeType: "YulIdentifier",
                                    src: "2654:2:7",
                                  },
                                ],
                                functionName: {
                                  name: "sstore",
                                  nodeType: "YulIdentifier",
                                  src: "2640:6:7",
                                },
                                nodeType: "YulFunctionCall",
                                src: "2640:17:7",
                              },
                              nodeType: "YulExpressionStatement",
                              src: "2640:17:7",
                            },
                          ],
                        },
                        condition: {
                          arguments: [
                            {
                              name: "start",
                              nodeType: "YulIdentifier",
                              src: "2588:5:7",
                            },
                            {
                              name: "_2",
                              nodeType: "YulIdentifier",
                              src: "2595:2:7",
                            },
                          ],
                          functionName: {
                            name: "lt",
                            nodeType: "YulIdentifier",
                            src: "2585:2:7",
                          },
                          nodeType: "YulFunctionCall",
                          src: "2585:13:7",
                        },
                        nodeType: "YulForLoop",
                        post: {
                          nodeType: "YulBlock",
                          src: "2599:26:7",
                          statements: [
                            {
                              nodeType: "YulAssignment",
                              src: "2601:22:7",
                              value: {
                                arguments: [
                                  {
                                    name: "start",
                                    nodeType: "YulIdentifier",
                                    src: "2614:5:7",
                                  },
                                  {
                                    kind: "number",
                                    nodeType: "YulLiteral",
                                    src: "2621:1:7",
                                    type: "",
                                    value: "1",
                                  },
                                ],
                                functionName: {
                                  name: "add",
                                  nodeType: "YulIdentifier",
                                  src: "2610:3:7",
                                },
                                nodeType: "YulFunctionCall",
                                src: "2610:13:7",
                              },
                              variableNames: [
                                {
                                  name: "start",
                                  nodeType: "YulIdentifier",
                                  src: "2601:5:7",
                                },
                              ],
                            },
                          ],
                        },
                        pre: {
                          nodeType: "YulBlock",
                          src: "2581:3:7",
                          statements: [],
                        },
                        src: "2577:82:7",
                      },
                    ],
                  },
                  condition: {
                    arguments: [
                      {
                        name: "len",
                        nodeType: "YulIdentifier",
                        src: "2227:3:7",
                      },
                      {
                        kind: "number",
                        nodeType: "YulLiteral",
                        src: "2232:2:7",
                        type: "",
                        value: "31",
                      },
                    ],
                    functionName: {
                      name: "gt",
                      nodeType: "YulIdentifier",
                      src: "2224:2:7",
                    },
                    nodeType: "YulFunctionCall",
                    src: "2224:11:7",
                  },
                  nodeType: "YulIf",
                  src: "2221:448:7",
                },
              ],
            },
            name: "clean_up_bytearray_end_slots_string_storage",
            nodeType: "YulFunctionDefinition",
            parameters: [
              {
                name: "array",
                nodeType: "YulTypedName",
                src: "2183:5:7",
                type: "",
              },
              {
                name: "len",
                nodeType: "YulTypedName",
                src: "2190:3:7",
                type: "",
              },
              {
                name: "startIndex",
                nodeType: "YulTypedName",
                src: "2195:10:7",
                type: "",
              },
            ],
            src: "2130:545:7",
          },
          {
            body: {
              nodeType: "YulBlock",
              src: "2765:81:7",
              statements: [
                {
                  nodeType: "YulAssignment",
                  src: "2775:65:7",
                  value: {
                    arguments: [
                      {
                        arguments: [
                          {
                            name: "data",
                            nodeType: "YulIdentifier",
                            src: "2790:4:7",
                          },
                          {
                            arguments: [
                              {
                                arguments: [
                                  {
                                    arguments: [
                                      {
                                        kind: "number",
                                        nodeType: "YulLiteral",
                                        src: "2808:1:7",
                                        type: "",
                                        value: "3",
                                      },
                                      {
                                        name: "len",
                                        nodeType: "YulIdentifier",
                                        src: "2811:3:7",
                                      },
                                    ],
                                    functionName: {
                                      name: "shl",
                                      nodeType: "YulIdentifier",
                                      src: "2804:3:7",
                                    },
                                    nodeType: "YulFunctionCall",
                                    src: "2804:11:7",
                                  },
                                  {
                                    arguments: [
                                      {
                                        kind: "number",
                                        nodeType: "YulLiteral",
                                        src: "2821:1:7",
                                        type: "",
                                        value: "0",
                                      },
                                    ],
                                    functionName: {
                                      name: "not",
                                      nodeType: "YulIdentifier",
                                      src: "2817:3:7",
                                    },
                                    nodeType: "YulFunctionCall",
                                    src: "2817:6:7",
                                  },
                                ],
                                functionName: {
                                  name: "shr",
                                  nodeType: "YulIdentifier",
                                  src: "2800:3:7",
                                },
                                nodeType: "YulFunctionCall",
                                src: "2800:24:7",
                              },
                            ],
                            functionName: {
                              name: "not",
                              nodeType: "YulIdentifier",
                              src: "2796:3:7",
                            },
                            nodeType: "YulFunctionCall",
                            src: "2796:29:7",
                          },
                        ],
                        functionName: {
                          name: "and",
                          nodeType: "YulIdentifier",
                          src: "2786:3:7",
                        },
                        nodeType: "YulFunctionCall",
                        src: "2786:40:7",
                      },
                      {
                        arguments: [
                          {
                            kind: "number",
                            nodeType: "YulLiteral",
                            src: "2832:1:7",
                            type: "",
                            value: "1",
                          },
                          {
                            name: "len",
                            nodeType: "YulIdentifier",
                            src: "2835:3:7",
                          },
                        ],
                        functionName: {
                          name: "shl",
                          nodeType: "YulIdentifier",
                          src: "2828:3:7",
                        },
                        nodeType: "YulFunctionCall",
                        src: "2828:11:7",
                      },
                    ],
                    functionName: {
                      name: "or",
                      nodeType: "YulIdentifier",
                      src: "2783:2:7",
                    },
                    nodeType: "YulFunctionCall",
                    src: "2783:57:7",
                  },
                  variableNames: [
                    {
                      name: "used",
                      nodeType: "YulIdentifier",
                      src: "2775:4:7",
                    },
                  ],
                },
              ],
            },
            name: "extract_used_part_and_set_length_of_short_byte_array",
            nodeType: "YulFunctionDefinition",
            parameters: [
              {
                name: "data",
                nodeType: "YulTypedName",
                src: "2742:4:7",
                type: "",
              },
              {
                name: "len",
                nodeType: "YulTypedName",
                src: "2748:3:7",
                type: "",
              },
            ],
            returnVariables: [
              {
                name: "used",
                nodeType: "YulTypedName",
                src: "2756:4:7",
                type: "",
              },
            ],
            src: "2680:166:7",
          },
          {
            body: {
              nodeType: "YulBlock",
              src: "2947:1256:7",
              statements: [
                {
                  nodeType: "YulVariableDeclaration",
                  src: "2957:24:7",
                  value: {
                    arguments: [
                      {
                        name: "src",
                        nodeType: "YulIdentifier",
                        src: "2977:3:7",
                      },
                    ],
                    functionName: {
                      name: "mload",
                      nodeType: "YulIdentifier",
                      src: "2971:5:7",
                    },
                    nodeType: "YulFunctionCall",
                    src: "2971:10:7",
                  },
                  variables: [
                    {
                      name: "newLen",
                      nodeType: "YulTypedName",
                      src: "2961:6:7",
                      type: "",
                    },
                  ],
                },
                {
                  body: {
                    nodeType: "YulBlock",
                    src: "3024:22:7",
                    statements: [
                      {
                        expression: {
                          arguments: [],
                          functionName: {
                            name: "panic_error_0x41",
                            nodeType: "YulIdentifier",
                            src: "3026:16:7",
                          },
                          nodeType: "YulFunctionCall",
                          src: "3026:18:7",
                        },
                        nodeType: "YulExpressionStatement",
                        src: "3026:18:7",
                      },
                    ],
                  },
                  condition: {
                    arguments: [
                      {
                        name: "newLen",
                        nodeType: "YulIdentifier",
                        src: "2996:6:7",
                      },
                      {
                        arguments: [
                          {
                            arguments: [
                              {
                                kind: "number",
                                nodeType: "YulLiteral",
                                src: "3012:2:7",
                                type: "",
                                value: "64",
                              },
                              {
                                kind: "number",
                                nodeType: "YulLiteral",
                                src: "3016:1:7",
                                type: "",
                                value: "1",
                              },
                            ],
                            functionName: {
                              name: "shl",
                              nodeType: "YulIdentifier",
                              src: "3008:3:7",
                            },
                            nodeType: "YulFunctionCall",
                            src: "3008:10:7",
                          },
                          {
                            kind: "number",
                            nodeType: "YulLiteral",
                            src: "3020:1:7",
                            type: "",
                            value: "1",
                          },
                        ],
                        functionName: {
                          name: "sub",
                          nodeType: "YulIdentifier",
                          src: "3004:3:7",
                        },
                        nodeType: "YulFunctionCall",
                        src: "3004:18:7",
                      },
                    ],
                    functionName: {
                      name: "gt",
                      nodeType: "YulIdentifier",
                      src: "2993:2:7",
                    },
                    nodeType: "YulFunctionCall",
                    src: "2993:30:7",
                  },
                  nodeType: "YulIf",
                  src: "2990:56:7",
                },
                {
                  expression: {
                    arguments: [
                      {
                        name: "slot",
                        nodeType: "YulIdentifier",
                        src: "3099:4:7",
                      },
                      {
                        arguments: [
                          {
                            arguments: [
                              {
                                name: "slot",
                                nodeType: "YulIdentifier",
                                src: "3137:4:7",
                              },
                            ],
                            functionName: {
                              name: "sload",
                              nodeType: "YulIdentifier",
                              src: "3131:5:7",
                            },
                            nodeType: "YulFunctionCall",
                            src: "3131:11:7",
                          },
                        ],
                        functionName: {
                          name: "extract_byte_array_length",
                          nodeType: "YulIdentifier",
                          src: "3105:25:7",
                        },
                        nodeType: "YulFunctionCall",
                        src: "3105:38:7",
                      },
                      {
                        name: "newLen",
                        nodeType: "YulIdentifier",
                        src: "3145:6:7",
                      },
                    ],
                    functionName: {
                      name: "clean_up_bytearray_end_slots_string_storage",
                      nodeType: "YulIdentifier",
                      src: "3055:43:7",
                    },
                    nodeType: "YulFunctionCall",
                    src: "3055:97:7",
                  },
                  nodeType: "YulExpressionStatement",
                  src: "3055:97:7",
                },
                {
                  nodeType: "YulVariableDeclaration",
                  src: "3161:18:7",
                  value: {
                    kind: "number",
                    nodeType: "YulLiteral",
                    src: "3178:1:7",
                    type: "",
                    value: "0",
                  },
                  variables: [
                    {
                      name: "srcOffset",
                      nodeType: "YulTypedName",
                      src: "3165:9:7",
                      type: "",
                    },
                  ],
                },
                {
                  nodeType: "YulVariableDeclaration",
                  src: "3188:23:7",
                  value: {
                    kind: "number",
                    nodeType: "YulLiteral",
                    src: "3207:4:7",
                    type: "",
                    value: "0x20",
                  },
                  variables: [
                    {
                      name: "srcOffset_1",
                      nodeType: "YulTypedName",
                      src: "3192:11:7",
                      type: "",
                    },
                  ],
                },
                {
                  nodeType: "YulAssignment",
                  src: "3220:24:7",
                  value: {
                    name: "srcOffset_1",
                    nodeType: "YulIdentifier",
                    src: "3233:11:7",
                  },
                  variableNames: [
                    {
                      name: "srcOffset",
                      nodeType: "YulIdentifier",
                      src: "3220:9:7",
                    },
                  ],
                },
                {
                  cases: [
                    {
                      body: {
                        nodeType: "YulBlock",
                        src: "3290:656:7",
                        statements: [
                          {
                            nodeType: "YulVariableDeclaration",
                            src: "3304:35:7",
                            value: {
                              arguments: [
                                {
                                  name: "newLen",
                                  nodeType: "YulIdentifier",
                                  src: "3323:6:7",
                                },
                                {
                                  arguments: [
                                    {
                                      kind: "number",
                                      nodeType: "YulLiteral",
                                      src: "3335:2:7",
                                      type: "",
                                      value: "31",
                                    },
                                  ],
                                  functionName: {
                                    name: "not",
                                    nodeType: "YulIdentifier",
                                    src: "3331:3:7",
                                  },
                                  nodeType: "YulFunctionCall",
                                  src: "3331:7:7",
                                },
                              ],
                              functionName: {
                                name: "and",
                                nodeType: "YulIdentifier",
                                src: "3319:3:7",
                              },
                              nodeType: "YulFunctionCall",
                              src: "3319:20:7",
                            },
                            variables: [
                              {
                                name: "loopEnd",
                                nodeType: "YulTypedName",
                                src: "3308:7:7",
                                type: "",
                              },
                            ],
                          },
                          {
                            nodeType: "YulVariableDeclaration",
                            src: "3352:49:7",
                            value: {
                              arguments: [
                                {
                                  name: "slot",
                                  nodeType: "YulIdentifier",
                                  src: "3396:4:7",
                                },
                              ],
                              functionName: {
                                name: "array_dataslot_string_storage",
                                nodeType: "YulIdentifier",
                                src: "3366:29:7",
                              },
                              nodeType: "YulFunctionCall",
                              src: "3366:35:7",
                            },
                            variables: [
                              {
                                name: "dstPtr",
                                nodeType: "YulTypedName",
                                src: "3356:6:7",
                                type: "",
                              },
                            ],
                          },
                          {
                            nodeType: "YulVariableDeclaration",
                            src: "3414:10:7",
                            value: {
                              kind: "number",
                              nodeType: "YulLiteral",
                              src: "3423:1:7",
                              type: "",
                              value: "0",
                            },
                            variables: [
                              {
                                name: "i",
                                nodeType: "YulTypedName",
                                src: "3418:1:7",
                                type: "",
                              },
                            ],
                          },
                          {
                            body: {
                              nodeType: "YulBlock",
                              src: "3501:172:7",
                              statements: [
                                {
                                  expression: {
                                    arguments: [
                                      {
                                        name: "dstPtr",
                                        nodeType: "YulIdentifier",
                                        src: "3526:6:7",
                                      },
                                      {
                                        arguments: [
                                          {
                                            arguments: [
                                              {
                                                name: "src",
                                                nodeType: "YulIdentifier",
                                                src: "3544:3:7",
                                              },
                                              {
                                                name: "srcOffset",
                                                nodeType: "YulIdentifier",
                                                src: "3549:9:7",
                                              },
                                            ],
                                            functionName: {
                                              name: "add",
                                              nodeType: "YulIdentifier",
                                              src: "3540:3:7",
                                            },
                                            nodeType: "YulFunctionCall",
                                            src: "3540:19:7",
                                          },
                                        ],
                                        functionName: {
                                          name: "mload",
                                          nodeType: "YulIdentifier",
                                          src: "3534:5:7",
                                        },
                                        nodeType: "YulFunctionCall",
                                        src: "3534:26:7",
                                      },
                                    ],
                                    functionName: {
                                      name: "sstore",
                                      nodeType: "YulIdentifier",
                                      src: "3519:6:7",
                                    },
                                    nodeType: "YulFunctionCall",
                                    src: "3519:42:7",
                                  },
                                  nodeType: "YulExpressionStatement",
                                  src: "3519:42:7",
                                },
                                {
                                  nodeType: "YulAssignment",
                                  src: "3578:24:7",
                                  value: {
                                    arguments: [
                                      {
                                        name: "dstPtr",
                                        nodeType: "YulIdentifier",
                                        src: "3592:6:7",
                                      },
                                      {
                                        kind: "number",
                                        nodeType: "YulLiteral",
                                        src: "3600:1:7",
                                        type: "",
                                        value: "1",
                                      },
                                    ],
                                    functionName: {
                                      name: "add",
                                      nodeType: "YulIdentifier",
                                      src: "3588:3:7",
                                    },
                                    nodeType: "YulFunctionCall",
                                    src: "3588:14:7",
                                  },
                                  variableNames: [
                                    {
                                      name: "dstPtr",
                                      nodeType: "YulIdentifier",
                                      src: "3578:6:7",
                                    },
                                  ],
                                },
                                {
                                  nodeType: "YulAssignment",
                                  src: "3619:40:7",
                                  value: {
                                    arguments: [
                                      {
                                        name: "srcOffset",
                                        nodeType: "YulIdentifier",
                                        src: "3636:9:7",
                                      },
                                      {
                                        name: "srcOffset_1",
                                        nodeType: "YulIdentifier",
                                        src: "3647:11:7",
                                      },
                                    ],
                                    functionName: {
                                      name: "add",
                                      nodeType: "YulIdentifier",
                                      src: "3632:3:7",
                                    },
                                    nodeType: "YulFunctionCall",
                                    src: "3632:27:7",
                                  },
                                  variableNames: [
                                    {
                                      name: "srcOffset",
                                      nodeType: "YulIdentifier",
                                      src: "3619:9:7",
                                    },
                                  ],
                                },
                              ],
                            },
                            condition: {
                              arguments: [
                                {
                                  name: "i",
                                  nodeType: "YulIdentifier",
                                  src: "3448:1:7",
                                },
                                {
                                  name: "loopEnd",
                                  nodeType: "YulIdentifier",
                                  src: "3451:7:7",
                                },
                              ],
                              functionName: {
                                name: "lt",
                                nodeType: "YulIdentifier",
                                src: "3445:2:7",
                              },
                              nodeType: "YulFunctionCall",
                              src: "3445:14:7",
                            },
                            nodeType: "YulForLoop",
                            post: {
                              nodeType: "YulBlock",
                              src: "3460:28:7",
                              statements: [
                                {
                                  nodeType: "YulAssignment",
                                  src: "3462:24:7",
                                  value: {
                                    arguments: [
                                      {
                                        name: "i",
                                        nodeType: "YulIdentifier",
                                        src: "3471:1:7",
                                      },
                                      {
                                        name: "srcOffset_1",
                                        nodeType: "YulIdentifier",
                                        src: "3474:11:7",
                                      },
                                    ],
                                    functionName: {
                                      name: "add",
                                      nodeType: "YulIdentifier",
                                      src: "3467:3:7",
                                    },
                                    nodeType: "YulFunctionCall",
                                    src: "3467:19:7",
                                  },
                                  variableNames: [
                                    {
                                      name: "i",
                                      nodeType: "YulIdentifier",
                                      src: "3462:1:7",
                                    },
                                  ],
                                },
                              ],
                            },
                            pre: {
                              nodeType: "YulBlock",
                              src: "3441:3:7",
                              statements: [],
                            },
                            src: "3437:236:7",
                          },
                          {
                            body: {
                              nodeType: "YulBlock",
                              src: "3721:166:7",
                              statements: [
                                {
                                  nodeType: "YulVariableDeclaration",
                                  src: "3739:43:7",
                                  value: {
                                    arguments: [
                                      {
                                        arguments: [
                                          {
                                            name: "src",
                                            nodeType: "YulIdentifier",
                                            src: "3766:3:7",
                                          },
                                          {
                                            name: "srcOffset",
                                            nodeType: "YulIdentifier",
                                            src: "3771:9:7",
                                          },
                                        ],
                                        functionName: {
                                          name: "add",
                                          nodeType: "YulIdentifier",
                                          src: "3762:3:7",
                                        },
                                        nodeType: "YulFunctionCall",
                                        src: "3762:19:7",
                                      },
                                    ],
                                    functionName: {
                                      name: "mload",
                                      nodeType: "YulIdentifier",
                                      src: "3756:5:7",
                                    },
                                    nodeType: "YulFunctionCall",
                                    src: "3756:26:7",
                                  },
                                  variables: [
                                    {
                                      name: "lastValue",
                                      nodeType: "YulTypedName",
                                      src: "3743:9:7",
                                      type: "",
                                    },
                                  ],
                                },
                                {
                                  expression: {
                                    arguments: [
                                      {
                                        name: "dstPtr",
                                        nodeType: "YulIdentifier",
                                        src: "3806:6:7",
                                      },
                                      {
                                        arguments: [
                                          {
                                            name: "lastValue",
                                            nodeType: "YulIdentifier",
                                            src: "3818:9:7",
                                          },
                                          {
                                            arguments: [
                                              {
                                                arguments: [
                                                  {
                                                    arguments: [
                                                      {
                                                        arguments: [
                                                          {
                                                            kind: "number",
                                                            nodeType:
                                                              "YulLiteral",
                                                            src: "3845:1:7",
                                                            type: "",
                                                            value: "3",
                                                          },
                                                          {
                                                            name: "newLen",
                                                            nodeType:
                                                              "YulIdentifier",
                                                            src: "3848:6:7",
                                                          },
                                                        ],
                                                        functionName: {
                                                          name: "shl",
                                                          nodeType:
                                                            "YulIdentifier",
                                                          src: "3841:3:7",
                                                        },
                                                        nodeType:
                                                          "YulFunctionCall",
                                                        src: "3841:14:7",
                                                      },
                                                      {
                                                        kind: "number",
                                                        nodeType: "YulLiteral",
                                                        src: "3857:3:7",
                                                        type: "",
                                                        value: "248",
                                                      },
                                                    ],
                                                    functionName: {
                                                      name: "and",
                                                      nodeType: "YulIdentifier",
                                                      src: "3837:3:7",
                                                    },
                                                    nodeType: "YulFunctionCall",
                                                    src: "3837:24:7",
                                                  },
                                                  {
                                                    arguments: [
                                                      {
                                                        kind: "number",
                                                        nodeType: "YulLiteral",
                                                        src: "3867:1:7",
                                                        type: "",
                                                        value: "0",
                                                      },
                                                    ],
                                                    functionName: {
                                                      name: "not",
                                                      nodeType: "YulIdentifier",
                                                      src: "3863:3:7",
                                                    },
                                                    nodeType: "YulFunctionCall",
                                                    src: "3863:6:7",
                                                  },
                                                ],
                                                functionName: {
                                                  name: "shr",
                                                  nodeType: "YulIdentifier",
                                                  src: "3833:3:7",
                                                },
                                                nodeType: "YulFunctionCall",
                                                src: "3833:37:7",
                                              },
                                            ],
                                            functionName: {
                                              name: "not",
                                              nodeType: "YulIdentifier",
                                              src: "3829:3:7",
                                            },
                                            nodeType: "YulFunctionCall",
                                            src: "3829:42:7",
                                          },
                                        ],
                                        functionName: {
                                          name: "and",
                                          nodeType: "YulIdentifier",
                                          src: "3814:3:7",
                                        },
                                        nodeType: "YulFunctionCall",
                                        src: "3814:58:7",
                                      },
                                    ],
                                    functionName: {
                                      name: "sstore",
                                      nodeType: "YulIdentifier",
                                      src: "3799:6:7",
                                    },
                                    nodeType: "YulFunctionCall",
                                    src: "3799:74:7",
                                  },
                                  nodeType: "YulExpressionStatement",
                                  src: "3799:74:7",
                                },
                              ],
                            },
                            condition: {
                              arguments: [
                                {
                                  name: "loopEnd",
                                  nodeType: "YulIdentifier",
                                  src: "3692:7:7",
                                },
                                {
                                  name: "newLen",
                                  nodeType: "YulIdentifier",
                                  src: "3701:6:7",
                                },
                              ],
                              functionName: {
                                name: "lt",
                                nodeType: "YulIdentifier",
                                src: "3689:2:7",
                              },
                              nodeType: "YulFunctionCall",
                              src: "3689:19:7",
                            },
                            nodeType: "YulIf",
                            src: "3686:201:7",
                          },
                          {
                            expression: {
                              arguments: [
                                {
                                  name: "slot",
                                  nodeType: "YulIdentifier",
                                  src: "3907:4:7",
                                },
                                {
                                  arguments: [
                                    {
                                      arguments: [
                                        {
                                          kind: "number",
                                          nodeType: "YulLiteral",
                                          src: "3921:1:7",
                                          type: "",
                                          value: "1",
                                        },
                                        {
                                          name: "newLen",
                                          nodeType: "YulIdentifier",
                                          src: "3924:6:7",
                                        },
                                      ],
                                      functionName: {
                                        name: "shl",
                                        nodeType: "YulIdentifier",
                                        src: "3917:3:7",
                                      },
                                      nodeType: "YulFunctionCall",
                                      src: "3917:14:7",
                                    },
                                    {
                                      kind: "number",
                                      nodeType: "YulLiteral",
                                      src: "3933:1:7",
                                      type: "",
                                      value: "1",
                                    },
                                  ],
                                  functionName: {
                                    name: "add",
                                    nodeType: "YulIdentifier",
                                    src: "3913:3:7",
                                  },
                                  nodeType: "YulFunctionCall",
                                  src: "3913:22:7",
                                },
                              ],
                              functionName: {
                                name: "sstore",
                                nodeType: "YulIdentifier",
                                src: "3900:6:7",
                              },
                              nodeType: "YulFunctionCall",
                              src: "3900:36:7",
                            },
                            nodeType: "YulExpressionStatement",
                            src: "3900:36:7",
                          },
                        ],
                      },
                      nodeType: "YulCase",
                      src: "3283:663:7",
                      value: {
                        kind: "number",
                        nodeType: "YulLiteral",
                        src: "3288:1:7",
                        type: "",
                        value: "1",
                      },
                    },
                    {
                      body: {
                        nodeType: "YulBlock",
                        src: "3963:234:7",
                        statements: [
                          {
                            nodeType: "YulVariableDeclaration",
                            src: "3977:14:7",
                            value: {
                              kind: "number",
                              nodeType: "YulLiteral",
                              src: "3990:1:7",
                              type: "",
                              value: "0",
                            },
                            variables: [
                              {
                                name: "value",
                                nodeType: "YulTypedName",
                                src: "3981:5:7",
                                type: "",
                              },
                            ],
                          },
                          {
                            body: {
                              nodeType: "YulBlock",
                              src: "4026:67:7",
                              statements: [
                                {
                                  nodeType: "YulAssignment",
                                  src: "4044:35:7",
                                  value: {
                                    arguments: [
                                      {
                                        arguments: [
                                          {
                                            name: "src",
                                            nodeType: "YulIdentifier",
                                            src: "4063:3:7",
                                          },
                                          {
                                            name: "srcOffset",
                                            nodeType: "YulIdentifier",
                                            src: "4068:9:7",
                                          },
                                        ],
                                        functionName: {
                                          name: "add",
                                          nodeType: "YulIdentifier",
                                          src: "4059:3:7",
                                        },
                                        nodeType: "YulFunctionCall",
                                        src: "4059:19:7",
                                      },
                                    ],
                                    functionName: {
                                      name: "mload",
                                      nodeType: "YulIdentifier",
                                      src: "4053:5:7",
                                    },
                                    nodeType: "YulFunctionCall",
                                    src: "4053:26:7",
                                  },
                                  variableNames: [
                                    {
                                      name: "value",
                                      nodeType: "YulIdentifier",
                                      src: "4044:5:7",
                                    },
                                  ],
                                },
                              ],
                            },
                            condition: {
                              name: "newLen",
                              nodeType: "YulIdentifier",
                              src: "4007:6:7",
                            },
                            nodeType: "YulIf",
                            src: "4004:89:7",
                          },
                          {
                            expression: {
                              arguments: [
                                {
                                  name: "slot",
                                  nodeType: "YulIdentifier",
                                  src: "4113:4:7",
                                },
                                {
                                  arguments: [
                                    {
                                      name: "value",
                                      nodeType: "YulIdentifier",
                                      src: "4172:5:7",
                                    },
                                    {
                                      name: "newLen",
                                      nodeType: "YulIdentifier",
                                      src: "4179:6:7",
                                    },
                                  ],
                                  functionName: {
                                    name: "extract_used_part_and_set_length_of_short_byte_array",
                                    nodeType: "YulIdentifier",
                                    src: "4119:52:7",
                                  },
                                  nodeType: "YulFunctionCall",
                                  src: "4119:67:7",
                                },
                              ],
                              functionName: {
                                name: "sstore",
                                nodeType: "YulIdentifier",
                                src: "4106:6:7",
                              },
                              nodeType: "YulFunctionCall",
                              src: "4106:81:7",
                            },
                            nodeType: "YulExpressionStatement",
                            src: "4106:81:7",
                          },
                        ],
                      },
                      nodeType: "YulCase",
                      src: "3955:242:7",
                      value: "default",
                    },
                  ],
                  expression: {
                    arguments: [
                      {
                        name: "newLen",
                        nodeType: "YulIdentifier",
                        src: "3263:6:7",
                      },
                      {
                        kind: "number",
                        nodeType: "YulLiteral",
                        src: "3271:2:7",
                        type: "",
                        value: "31",
                      },
                    ],
                    functionName: {
                      name: "gt",
                      nodeType: "YulIdentifier",
                      src: "3260:2:7",
                    },
                    nodeType: "YulFunctionCall",
                    src: "3260:14:7",
                  },
                  nodeType: "YulSwitch",
                  src: "3253:944:7",
                },
              ],
            },
            name: "copy_byte_array_to_storage_from_t_string_memory_ptr_to_t_string_storage",
            nodeType: "YulFunctionDefinition",
            parameters: [
              {
                name: "slot",
                nodeType: "YulTypedName",
                src: "2932:4:7",
                type: "",
              },
              {
                name: "src",
                nodeType: "YulTypedName",
                src: "2938:3:7",
                type: "",
              },
            ],
            src: "2851:1352:7",
          },
          {
            body: {
              nodeType: "YulBlock",
              src: "4309:102:7",
              statements: [
                {
                  nodeType: "YulAssignment",
                  src: "4319:26:7",
                  value: {
                    arguments: [
                      {
                        name: "headStart",
                        nodeType: "YulIdentifier",
                        src: "4331:9:7",
                      },
                      {
                        kind: "number",
                        nodeType: "YulLiteral",
                        src: "4342:2:7",
                        type: "",
                        value: "32",
                      },
                    ],
                    functionName: {
                      name: "add",
                      nodeType: "YulIdentifier",
                      src: "4327:3:7",
                    },
                    nodeType: "YulFunctionCall",
                    src: "4327:18:7",
                  },
                  variableNames: [
                    {
                      name: "tail",
                      nodeType: "YulIdentifier",
                      src: "4319:4:7",
                    },
                  ],
                },
                {
                  expression: {
                    arguments: [
                      {
                        name: "headStart",
                        nodeType: "YulIdentifier",
                        src: "4361:9:7",
                      },
                      {
                        arguments: [
                          {
                            name: "value0",
                            nodeType: "YulIdentifier",
                            src: "4376:6:7",
                          },
                          {
                            arguments: [
                              {
                                arguments: [
                                  {
                                    kind: "number",
                                    nodeType: "YulLiteral",
                                    src: "4392:3:7",
                                    type: "",
                                    value: "160",
                                  },
                                  {
                                    kind: "number",
                                    nodeType: "YulLiteral",
                                    src: "4397:1:7",
                                    type: "",
                                    value: "1",
                                  },
                                ],
                                functionName: {
                                  name: "shl",
                                  nodeType: "YulIdentifier",
                                  src: "4388:3:7",
                                },
                                nodeType: "YulFunctionCall",
                                src: "4388:11:7",
                              },
                              {
                                kind: "number",
                                nodeType: "YulLiteral",
                                src: "4401:1:7",
                                type: "",
                                value: "1",
                              },
                            ],
                            functionName: {
                              name: "sub",
                              nodeType: "YulIdentifier",
                              src: "4384:3:7",
                            },
                            nodeType: "YulFunctionCall",
                            src: "4384:19:7",
                          },
                        ],
                        functionName: {
                          name: "and",
                          nodeType: "YulIdentifier",
                          src: "4372:3:7",
                        },
                        nodeType: "YulFunctionCall",
                        src: "4372:32:7",
                      },
                    ],
                    functionName: {
                      name: "mstore",
                      nodeType: "YulIdentifier",
                      src: "4354:6:7",
                    },
                    nodeType: "YulFunctionCall",
                    src: "4354:51:7",
                  },
                  nodeType: "YulExpressionStatement",
                  src: "4354:51:7",
                },
              ],
            },
            name: "abi_encode_tuple_t_address__to_t_address__fromStack_reversed",
            nodeType: "YulFunctionDefinition",
            parameters: [
              {
                name: "headStart",
                nodeType: "YulTypedName",
                src: "4278:9:7",
                type: "",
              },
              {
                name: "value0",
                nodeType: "YulTypedName",
                src: "4289:6:7",
                type: "",
              },
            ],
            returnVariables: [
              {
                name: "tail",
                nodeType: "YulTypedName",
                src: "4300:4:7",
                type: "",
              },
            ],
            src: "4208:203:7",
          },
          {
            body: {
              nodeType: "YulBlock",
              src: "4448:95:7",
              statements: [
                {
                  expression: {
                    arguments: [
                      {
                        kind: "number",
                        nodeType: "YulLiteral",
                        src: "4465:1:7",
                        type: "",
                        value: "0",
                      },
                      {
                        arguments: [
                          {
                            kind: "number",
                            nodeType: "YulLiteral",
                            src: "4472:3:7",
                            type: "",
                            value: "224",
                          },
                          {
                            kind: "number",
                            nodeType: "YulLiteral",
                            src: "4477:10:7",
                            type: "",
                            value: "0x4e487b71",
                          },
                        ],
                        functionName: {
                          name: "shl",
                          nodeType: "YulIdentifier",
                          src: "4468:3:7",
                        },
                        nodeType: "YulFunctionCall",
                        src: "4468:20:7",
                      },
                    ],
                    functionName: {
                      name: "mstore",
                      nodeType: "YulIdentifier",
                      src: "4458:6:7",
                    },
                    nodeType: "YulFunctionCall",
                    src: "4458:31:7",
                  },
                  nodeType: "YulExpressionStatement",
                  src: "4458:31:7",
                },
                {
                  expression: {
                    arguments: [
                      {
                        kind: "number",
                        nodeType: "YulLiteral",
                        src: "4505:1:7",
                        type: "",
                        value: "4",
                      },
                      {
                        kind: "number",
                        nodeType: "YulLiteral",
                        src: "4508:4:7",
                        type: "",
                        value: "0x11",
                      },
                    ],
                    functionName: {
                      name: "mstore",
                      nodeType: "YulIdentifier",
                      src: "4498:6:7",
                    },
                    nodeType: "YulFunctionCall",
                    src: "4498:15:7",
                  },
                  nodeType: "YulExpressionStatement",
                  src: "4498:15:7",
                },
                {
                  expression: {
                    arguments: [
                      {
                        kind: "number",
                        nodeType: "YulLiteral",
                        src: "4529:1:7",
                        type: "",
                        value: "0",
                      },
                      {
                        kind: "number",
                        nodeType: "YulLiteral",
                        src: "4532:4:7",
                        type: "",
                        value: "0x24",
                      },
                    ],
                    functionName: {
                      name: "revert",
                      nodeType: "YulIdentifier",
                      src: "4522:6:7",
                    },
                    nodeType: "YulFunctionCall",
                    src: "4522:15:7",
                  },
                  nodeType: "YulExpressionStatement",
                  src: "4522:15:7",
                },
              ],
            },
            name: "panic_error_0x11",
            nodeType: "YulFunctionDefinition",
            src: "4416:127:7",
          },
          {
            body: {
              nodeType: "YulBlock",
              src: "4612:358:7",
              statements: [
                {
                  nodeType: "YulVariableDeclaration",
                  src: "4622:16:7",
                  value: {
                    kind: "number",
                    nodeType: "YulLiteral",
                    src: "4637:1:7",
                    type: "",
                    value: "1",
                  },
                  variables: [
                    {
                      name: "power_1",
                      nodeType: "YulTypedName",
                      src: "4626:7:7",
                      type: "",
                    },
                  ],
                },
                {
                  nodeType: "YulAssignment",
                  src: "4647:16:7",
                  value: {
                    name: "power_1",
                    nodeType: "YulIdentifier",
                    src: "4656:7:7",
                  },
                  variableNames: [
                    {
                      name: "power",
                      nodeType: "YulIdentifier",
                      src: "4647:5:7",
                    },
                  ],
                },
                {
                  nodeType: "YulAssignment",
                  src: "4672:13:7",
                  value: {
                    name: "_base",
                    nodeType: "YulIdentifier",
                    src: "4680:5:7",
                  },
                  variableNames: [
                    {
                      name: "base",
                      nodeType: "YulIdentifier",
                      src: "4672:4:7",
                    },
                  ],
                },
                {
                  body: {
                    nodeType: "YulBlock",
                    src: "4736:228:7",
                    statements: [
                      {
                        body: {
                          nodeType: "YulBlock",
                          src: "4781:22:7",
                          statements: [
                            {
                              expression: {
                                arguments: [],
                                functionName: {
                                  name: "panic_error_0x11",
                                  nodeType: "YulIdentifier",
                                  src: "4783:16:7",
                                },
                                nodeType: "YulFunctionCall",
                                src: "4783:18:7",
                              },
                              nodeType: "YulExpressionStatement",
                              src: "4783:18:7",
                            },
                          ],
                        },
                        condition: {
                          arguments: [
                            {
                              name: "base",
                              nodeType: "YulIdentifier",
                              src: "4756:4:7",
                            },
                            {
                              arguments: [
                                {
                                  arguments: [
                                    {
                                      kind: "number",
                                      nodeType: "YulLiteral",
                                      src: "4770:1:7",
                                      type: "",
                                      value: "0",
                                    },
                                  ],
                                  functionName: {
                                    name: "not",
                                    nodeType: "YulIdentifier",
                                    src: "4766:3:7",
                                  },
                                  nodeType: "YulFunctionCall",
                                  src: "4766:6:7",
                                },
                                {
                                  name: "base",
                                  nodeType: "YulIdentifier",
                                  src: "4774:4:7",
                                },
                              ],
                              functionName: {
                                name: "div",
                                nodeType: "YulIdentifier",
                                src: "4762:3:7",
                              },
                              nodeType: "YulFunctionCall",
                              src: "4762:17:7",
                            },
                          ],
                          functionName: {
                            name: "gt",
                            nodeType: "YulIdentifier",
                            src: "4753:2:7",
                          },
                          nodeType: "YulFunctionCall",
                          src: "4753:27:7",
                        },
                        nodeType: "YulIf",
                        src: "4750:53:7",
                      },
                      {
                        body: {
                          nodeType: "YulBlock",
                          src: "4842:29:7",
                          statements: [
                            {
                              nodeType: "YulAssignment",
                              src: "4844:25:7",
                              value: {
                                arguments: [
                                  {
                                    name: "power",
                                    nodeType: "YulIdentifier",
                                    src: "4857:5:7",
                                  },
                                  {
                                    name: "base",
                                    nodeType: "YulIdentifier",
                                    src: "4864:4:7",
                                  },
                                ],
                                functionName: {
                                  name: "mul",
                                  nodeType: "YulIdentifier",
                                  src: "4853:3:7",
                                },
                                nodeType: "YulFunctionCall",
                                src: "4853:16:7",
                              },
                              variableNames: [
                                {
                                  name: "power",
                                  nodeType: "YulIdentifier",
                                  src: "4844:5:7",
                                },
                              ],
                            },
                          ],
                        },
                        condition: {
                          arguments: [
                            {
                              name: "exponent",
                              nodeType: "YulIdentifier",
                              src: "4823:8:7",
                            },
                            {
                              name: "power_1",
                              nodeType: "YulIdentifier",
                              src: "4833:7:7",
                            },
                          ],
                          functionName: {
                            name: "and",
                            nodeType: "YulIdentifier",
                            src: "4819:3:7",
                          },
                          nodeType: "YulFunctionCall",
                          src: "4819:22:7",
                        },
                        nodeType: "YulIf",
                        src: "4816:55:7",
                      },
                      {
                        nodeType: "YulAssignment",
                        src: "4884:23:7",
                        value: {
                          arguments: [
                            {
                              name: "base",
                              nodeType: "YulIdentifier",
                              src: "4896:4:7",
                            },
                            {
                              name: "base",
                              nodeType: "YulIdentifier",
                              src: "4902:4:7",
                            },
                          ],
                          functionName: {
                            name: "mul",
                            nodeType: "YulIdentifier",
                            src: "4892:3:7",
                          },
                          nodeType: "YulFunctionCall",
                          src: "4892:15:7",
                        },
                        variableNames: [
                          {
                            name: "base",
                            nodeType: "YulIdentifier",
                            src: "4884:4:7",
                          },
                        ],
                      },
                      {
                        nodeType: "YulAssignment",
                        src: "4920:34:7",
                        value: {
                          arguments: [
                            {
                              name: "power_1",
                              nodeType: "YulIdentifier",
                              src: "4936:7:7",
                            },
                            {
                              name: "exponent",
                              nodeType: "YulIdentifier",
                              src: "4945:8:7",
                            },
                          ],
                          functionName: {
                            name: "shr",
                            nodeType: "YulIdentifier",
                            src: "4932:3:7",
                          },
                          nodeType: "YulFunctionCall",
                          src: "4932:22:7",
                        },
                        variableNames: [
                          {
                            name: "exponent",
                            nodeType: "YulIdentifier",
                            src: "4920:8:7",
                          },
                        ],
                      },
                    ],
                  },
                  condition: {
                    arguments: [
                      {
                        name: "exponent",
                        nodeType: "YulIdentifier",
                        src: "4705:8:7",
                      },
                      {
                        name: "power_1",
                        nodeType: "YulIdentifier",
                        src: "4715:7:7",
                      },
                    ],
                    functionName: {
                      name: "gt",
                      nodeType: "YulIdentifier",
                      src: "4702:2:7",
                    },
                    nodeType: "YulFunctionCall",
                    src: "4702:21:7",
                  },
                  nodeType: "YulForLoop",
                  post: {
                    nodeType: "YulBlock",
                    src: "4724:3:7",
                    statements: [],
                  },
                  pre: {
                    nodeType: "YulBlock",
                    src: "4698:3:7",
                    statements: [],
                  },
                  src: "4694:270:7",
                },
              ],
            },
            name: "checked_exp_helper",
            nodeType: "YulFunctionDefinition",
            parameters: [
              {
                name: "_base",
                nodeType: "YulTypedName",
                src: "4576:5:7",
                type: "",
              },
              {
                name: "exponent",
                nodeType: "YulTypedName",
                src: "4583:8:7",
                type: "",
              },
            ],
            returnVariables: [
              {
                name: "power",
                nodeType: "YulTypedName",
                src: "4596:5:7",
                type: "",
              },
              {
                name: "base",
                nodeType: "YulTypedName",
                src: "4603:4:7",
                type: "",
              },
            ],
            src: "4548:422:7",
          },
          {
            body: {
              nodeType: "YulBlock",
              src: "5034:747:7",
              statements: [
                {
                  body: {
                    nodeType: "YulBlock",
                    src: "5072:52:7",
                    statements: [
                      {
                        nodeType: "YulAssignment",
                        src: "5086:10:7",
                        value: {
                          kind: "number",
                          nodeType: "YulLiteral",
                          src: "5095:1:7",
                          type: "",
                          value: "1",
                        },
                        variableNames: [
                          {
                            name: "power",
                            nodeType: "YulIdentifier",
                            src: "5086:5:7",
                          },
                        ],
                      },
                      {
                        nodeType: "YulLeave",
                        src: "5109:5:7",
                      },
                    ],
                  },
                  condition: {
                    arguments: [
                      {
                        name: "exponent",
                        nodeType: "YulIdentifier",
                        src: "5054:8:7",
                      },
                    ],
                    functionName: {
                      name: "iszero",
                      nodeType: "YulIdentifier",
                      src: "5047:6:7",
                    },
                    nodeType: "YulFunctionCall",
                    src: "5047:16:7",
                  },
                  nodeType: "YulIf",
                  src: "5044:80:7",
                },
                {
                  body: {
                    nodeType: "YulBlock",
                    src: "5157:52:7",
                    statements: [
                      {
                        nodeType: "YulAssignment",
                        src: "5171:10:7",
                        value: {
                          kind: "number",
                          nodeType: "YulLiteral",
                          src: "5180:1:7",
                          type: "",
                          value: "0",
                        },
                        variableNames: [
                          {
                            name: "power",
                            nodeType: "YulIdentifier",
                            src: "5171:5:7",
                          },
                        ],
                      },
                      {
                        nodeType: "YulLeave",
                        src: "5194:5:7",
                      },
                    ],
                  },
                  condition: {
                    arguments: [
                      {
                        name: "base",
                        nodeType: "YulIdentifier",
                        src: "5143:4:7",
                      },
                    ],
                    functionName: {
                      name: "iszero",
                      nodeType: "YulIdentifier",
                      src: "5136:6:7",
                    },
                    nodeType: "YulFunctionCall",
                    src: "5136:12:7",
                  },
                  nodeType: "YulIf",
                  src: "5133:76:7",
                },
                {
                  cases: [
                    {
                      body: {
                        nodeType: "YulBlock",
                        src: "5245:52:7",
                        statements: [
                          {
                            nodeType: "YulAssignment",
                            src: "5259:10:7",
                            value: {
                              kind: "number",
                              nodeType: "YulLiteral",
                              src: "5268:1:7",
                              type: "",
                              value: "1",
                            },
                            variableNames: [
                              {
                                name: "power",
                                nodeType: "YulIdentifier",
                                src: "5259:5:7",
                              },
                            ],
                          },
                          {
                            nodeType: "YulLeave",
                            src: "5282:5:7",
                          },
                        ],
                      },
                      nodeType: "YulCase",
                      src: "5238:59:7",
                      value: {
                        kind: "number",
                        nodeType: "YulLiteral",
                        src: "5243:1:7",
                        type: "",
                        value: "1",
                      },
                    },
                    {
                      body: {
                        nodeType: "YulBlock",
                        src: "5313:123:7",
                        statements: [
                          {
                            body: {
                              nodeType: "YulBlock",
                              src: "5348:22:7",
                              statements: [
                                {
                                  expression: {
                                    arguments: [],
                                    functionName: {
                                      name: "panic_error_0x11",
                                      nodeType: "YulIdentifier",
                                      src: "5350:16:7",
                                    },
                                    nodeType: "YulFunctionCall",
                                    src: "5350:18:7",
                                  },
                                  nodeType: "YulExpressionStatement",
                                  src: "5350:18:7",
                                },
                              ],
                            },
                            condition: {
                              arguments: [
                                {
                                  name: "exponent",
                                  nodeType: "YulIdentifier",
                                  src: "5333:8:7",
                                },
                                {
                                  kind: "number",
                                  nodeType: "YulLiteral",
                                  src: "5343:3:7",
                                  type: "",
                                  value: "255",
                                },
                              ],
                              functionName: {
                                name: "gt",
                                nodeType: "YulIdentifier",
                                src: "5330:2:7",
                              },
                              nodeType: "YulFunctionCall",
                              src: "5330:17:7",
                            },
                            nodeType: "YulIf",
                            src: "5327:43:7",
                          },
                          {
                            nodeType: "YulAssignment",
                            src: "5383:25:7",
                            value: {
                              arguments: [
                                {
                                  name: "exponent",
                                  nodeType: "YulIdentifier",
                                  src: "5396:8:7",
                                },
                                {
                                  kind: "number",
                                  nodeType: "YulLiteral",
                                  src: "5406:1:7",
                                  type: "",
                                  value: "1",
                                },
                              ],
                              functionName: {
                                name: "shl",
                                nodeType: "YulIdentifier",
                                src: "5392:3:7",
                              },
                              nodeType: "YulFunctionCall",
                              src: "5392:16:7",
                            },
                            variableNames: [
                              {
                                name: "power",
                                nodeType: "YulIdentifier",
                                src: "5383:5:7",
                              },
                            ],
                          },
                          {
                            nodeType: "YulLeave",
                            src: "5421:5:7",
                          },
                        ],
                      },
                      nodeType: "YulCase",
                      src: "5306:130:7",
                      value: {
                        kind: "number",
                        nodeType: "YulLiteral",
                        src: "5311:1:7",
                        type: "",
                        value: "2",
                      },
                    },
                  ],
                  expression: {
                    name: "base",
                    nodeType: "YulIdentifier",
                    src: "5225:4:7",
                  },
                  nodeType: "YulSwitch",
                  src: "5218:218:7",
                },
                {
                  body: {
                    nodeType: "YulBlock",
                    src: "5534:70:7",
                    statements: [
                      {
                        nodeType: "YulAssignment",
                        src: "5548:28:7",
                        value: {
                          arguments: [
                            {
                              name: "base",
                              nodeType: "YulIdentifier",
                              src: "5561:4:7",
                            },
                            {
                              name: "exponent",
                              nodeType: "YulIdentifier",
                              src: "5567:8:7",
                            },
                          ],
                          functionName: {
                            name: "exp",
                            nodeType: "YulIdentifier",
                            src: "5557:3:7",
                          },
                          nodeType: "YulFunctionCall",
                          src: "5557:19:7",
                        },
                        variableNames: [
                          {
                            name: "power",
                            nodeType: "YulIdentifier",
                            src: "5548:5:7",
                          },
                        ],
                      },
                      {
                        nodeType: "YulLeave",
                        src: "5589:5:7",
                      },
                    ],
                  },
                  condition: {
                    arguments: [
                      {
                        arguments: [
                          {
                            arguments: [
                              {
                                name: "base",
                                nodeType: "YulIdentifier",
                                src: "5458:4:7",
                              },
                              {
                                kind: "number",
                                nodeType: "YulLiteral",
                                src: "5464:2:7",
                                type: "",
                                value: "11",
                              },
                            ],
                            functionName: {
                              name: "lt",
                              nodeType: "YulIdentifier",
                              src: "5455:2:7",
                            },
                            nodeType: "YulFunctionCall",
                            src: "5455:12:7",
                          },
                          {
                            arguments: [
                              {
                                name: "exponent",
                                nodeType: "YulIdentifier",
                                src: "5472:8:7",
                              },
                              {
                                kind: "number",
                                nodeType: "YulLiteral",
                                src: "5482:2:7",
                                type: "",
                                value: "78",
                              },
                            ],
                            functionName: {
                              name: "lt",
                              nodeType: "YulIdentifier",
                              src: "5469:2:7",
                            },
                            nodeType: "YulFunctionCall",
                            src: "5469:16:7",
                          },
                        ],
                        functionName: {
                          name: "and",
                          nodeType: "YulIdentifier",
                          src: "5451:3:7",
                        },
                        nodeType: "YulFunctionCall",
                        src: "5451:35:7",
                      },
                      {
                        arguments: [
                          {
                            arguments: [
                              {
                                name: "base",
                                nodeType: "YulIdentifier",
                                src: "5495:4:7",
                              },
                              {
                                kind: "number",
                                nodeType: "YulLiteral",
                                src: "5501:3:7",
                                type: "",
                                value: "307",
                              },
                            ],
                            functionName: {
                              name: "lt",
                              nodeType: "YulIdentifier",
                              src: "5492:2:7",
                            },
                            nodeType: "YulFunctionCall",
                            src: "5492:13:7",
                          },
                          {
                            arguments: [
                              {
                                name: "exponent",
                                nodeType: "YulIdentifier",
                                src: "5510:8:7",
                              },
                              {
                                kind: "number",
                                nodeType: "YulLiteral",
                                src: "5520:2:7",
                                type: "",
                                value: "32",
                              },
                            ],
                            functionName: {
                              name: "lt",
                              nodeType: "YulIdentifier",
                              src: "5507:2:7",
                            },
                            nodeType: "YulFunctionCall",
                            src: "5507:16:7",
                          },
                        ],
                        functionName: {
                          name: "and",
                          nodeType: "YulIdentifier",
                          src: "5488:3:7",
                        },
                        nodeType: "YulFunctionCall",
                        src: "5488:36:7",
                      },
                    ],
                    functionName: {
                      name: "or",
                      nodeType: "YulIdentifier",
                      src: "5448:2:7",
                    },
                    nodeType: "YulFunctionCall",
                    src: "5448:77:7",
                  },
                  nodeType: "YulIf",
                  src: "5445:159:7",
                },
                {
                  nodeType: "YulVariableDeclaration",
                  src: "5613:57:7",
                  value: {
                    arguments: [
                      {
                        name: "base",
                        nodeType: "YulIdentifier",
                        src: "5655:4:7",
                      },
                      {
                        name: "exponent",
                        nodeType: "YulIdentifier",
                        src: "5661:8:7",
                      },
                    ],
                    functionName: {
                      name: "checked_exp_helper",
                      nodeType: "YulIdentifier",
                      src: "5636:18:7",
                    },
                    nodeType: "YulFunctionCall",
                    src: "5636:34:7",
                  },
                  variables: [
                    {
                      name: "power_1",
                      nodeType: "YulTypedName",
                      src: "5617:7:7",
                      type: "",
                    },
                    {
                      name: "base_1",
                      nodeType: "YulTypedName",
                      src: "5626:6:7",
                      type: "",
                    },
                  ],
                },
                {
                  body: {
                    nodeType: "YulBlock",
                    src: "5715:22:7",
                    statements: [
                      {
                        expression: {
                          arguments: [],
                          functionName: {
                            name: "panic_error_0x11",
                            nodeType: "YulIdentifier",
                            src: "5717:16:7",
                          },
                          nodeType: "YulFunctionCall",
                          src: "5717:18:7",
                        },
                        nodeType: "YulExpressionStatement",
                        src: "5717:18:7",
                      },
                    ],
                  },
                  condition: {
                    arguments: [
                      {
                        name: "power_1",
                        nodeType: "YulIdentifier",
                        src: "5685:7:7",
                      },
                      {
                        arguments: [
                          {
                            arguments: [
                              {
                                kind: "number",
                                nodeType: "YulLiteral",
                                src: "5702:1:7",
                                type: "",
                                value: "0",
                              },
                            ],
                            functionName: {
                              name: "not",
                              nodeType: "YulIdentifier",
                              src: "5698:3:7",
                            },
                            nodeType: "YulFunctionCall",
                            src: "5698:6:7",
                          },
                          {
                            name: "base_1",
                            nodeType: "YulIdentifier",
                            src: "5706:6:7",
                          },
                        ],
                        functionName: {
                          name: "div",
                          nodeType: "YulIdentifier",
                          src: "5694:3:7",
                        },
                        nodeType: "YulFunctionCall",
                        src: "5694:19:7",
                      },
                    ],
                    functionName: {
                      name: "gt",
                      nodeType: "YulIdentifier",
                      src: "5682:2:7",
                    },
                    nodeType: "YulFunctionCall",
                    src: "5682:32:7",
                  },
                  nodeType: "YulIf",
                  src: "5679:58:7",
                },
                {
                  nodeType: "YulAssignment",
                  src: "5746:29:7",
                  value: {
                    arguments: [
                      {
                        name: "power_1",
                        nodeType: "YulIdentifier",
                        src: "5759:7:7",
                      },
                      {
                        name: "base_1",
                        nodeType: "YulIdentifier",
                        src: "5768:6:7",
                      },
                    ],
                    functionName: {
                      name: "mul",
                      nodeType: "YulIdentifier",
                      src: "5755:3:7",
                    },
                    nodeType: "YulFunctionCall",
                    src: "5755:20:7",
                  },
                  variableNames: [
                    {
                      name: "power",
                      nodeType: "YulIdentifier",
                      src: "5746:5:7",
                    },
                  ],
                },
              ],
            },
            name: "checked_exp_unsigned",
            nodeType: "YulFunctionDefinition",
            parameters: [
              {
                name: "base",
                nodeType: "YulTypedName",
                src: "5005:4:7",
                type: "",
              },
              {
                name: "exponent",
                nodeType: "YulTypedName",
                src: "5011:8:7",
                type: "",
              },
            ],
            returnVariables: [
              {
                name: "power",
                nodeType: "YulTypedName",
                src: "5024:5:7",
                type: "",
              },
            ],
            src: "4975:806:7",
          },
          {
            body: {
              nodeType: "YulBlock",
              src: "5854:72:7",
              statements: [
                {
                  nodeType: "YulAssignment",
                  src: "5864:56:7",
                  value: {
                    arguments: [
                      {
                        name: "base",
                        nodeType: "YulIdentifier",
                        src: "5894:4:7",
                      },
                      {
                        arguments: [
                          {
                            name: "exponent",
                            nodeType: "YulIdentifier",
                            src: "5904:8:7",
                          },
                          {
                            kind: "number",
                            nodeType: "YulLiteral",
                            src: "5914:4:7",
                            type: "",
                            value: "0xff",
                          },
                        ],
                        functionName: {
                          name: "and",
                          nodeType: "YulIdentifier",
                          src: "5900:3:7",
                        },
                        nodeType: "YulFunctionCall",
                        src: "5900:19:7",
                      },
                    ],
                    functionName: {
                      name: "checked_exp_unsigned",
                      nodeType: "YulIdentifier",
                      src: "5873:20:7",
                    },
                    nodeType: "YulFunctionCall",
                    src: "5873:47:7",
                  },
                  variableNames: [
                    {
                      name: "power",
                      nodeType: "YulIdentifier",
                      src: "5864:5:7",
                    },
                  ],
                },
              ],
            },
            name: "checked_exp_t_uint256_t_uint8",
            nodeType: "YulFunctionDefinition",
            parameters: [
              {
                name: "base",
                nodeType: "YulTypedName",
                src: "5825:4:7",
                type: "",
              },
              {
                name: "exponent",
                nodeType: "YulTypedName",
                src: "5831:8:7",
                type: "",
              },
            ],
            returnVariables: [
              {
                name: "power",
                nodeType: "YulTypedName",
                src: "5844:5:7",
                type: "",
              },
            ],
            src: "5786:140:7",
          },
          {
            body: {
              nodeType: "YulBlock",
              src: "5983:116:7",
              statements: [
                {
                  nodeType: "YulAssignment",
                  src: "5993:20:7",
                  value: {
                    arguments: [
                      {
                        name: "x",
                        nodeType: "YulIdentifier",
                        src: "6008:1:7",
                      },
                      {
                        name: "y",
                        nodeType: "YulIdentifier",
                        src: "6011:1:7",
                      },
                    ],
                    functionName: {
                      name: "mul",
                      nodeType: "YulIdentifier",
                      src: "6004:3:7",
                    },
                    nodeType: "YulFunctionCall",
                    src: "6004:9:7",
                  },
                  variableNames: [
                    {
                      name: "product",
                      nodeType: "YulIdentifier",
                      src: "5993:7:7",
                    },
                  ],
                },
                {
                  body: {
                    nodeType: "YulBlock",
                    src: "6071:22:7",
                    statements: [
                      {
                        expression: {
                          arguments: [],
                          functionName: {
                            name: "panic_error_0x11",
                            nodeType: "YulIdentifier",
                            src: "6073:16:7",
                          },
                          nodeType: "YulFunctionCall",
                          src: "6073:18:7",
                        },
                        nodeType: "YulExpressionStatement",
                        src: "6073:18:7",
                      },
                    ],
                  },
                  condition: {
                    arguments: [
                      {
                        arguments: [
                          {
                            arguments: [
                              {
                                name: "x",
                                nodeType: "YulIdentifier",
                                src: "6042:1:7",
                              },
                            ],
                            functionName: {
                              name: "iszero",
                              nodeType: "YulIdentifier",
                              src: "6035:6:7",
                            },
                            nodeType: "YulFunctionCall",
                            src: "6035:9:7",
                          },
                          {
                            arguments: [
                              {
                                name: "y",
                                nodeType: "YulIdentifier",
                                src: "6049:1:7",
                              },
                              {
                                arguments: [
                                  {
                                    name: "product",
                                    nodeType: "YulIdentifier",
                                    src: "6056:7:7",
                                  },
                                  {
                                    name: "x",
                                    nodeType: "YulIdentifier",
                                    src: "6065:1:7",
                                  },
                                ],
                                functionName: {
                                  name: "div",
                                  nodeType: "YulIdentifier",
                                  src: "6052:3:7",
                                },
                                nodeType: "YulFunctionCall",
                                src: "6052:15:7",
                              },
                            ],
                            functionName: {
                              name: "eq",
                              nodeType: "YulIdentifier",
                              src: "6046:2:7",
                            },
                            nodeType: "YulFunctionCall",
                            src: "6046:22:7",
                          },
                        ],
                        functionName: {
                          name: "or",
                          nodeType: "YulIdentifier",
                          src: "6032:2:7",
                        },
                        nodeType: "YulFunctionCall",
                        src: "6032:37:7",
                      },
                    ],
                    functionName: {
                      name: "iszero",
                      nodeType: "YulIdentifier",
                      src: "6025:6:7",
                    },
                    nodeType: "YulFunctionCall",
                    src: "6025:45:7",
                  },
                  nodeType: "YulIf",
                  src: "6022:71:7",
                },
              ],
            },
            name: "checked_mul_t_uint256",
            nodeType: "YulFunctionDefinition",
            parameters: [
              {
                name: "x",
                nodeType: "YulTypedName",
                src: "5962:1:7",
                type: "",
              },
              {
                name: "y",
                nodeType: "YulTypedName",
                src: "5965:1:7",
                type: "",
              },
            ],
            returnVariables: [
              {
                name: "product",
                nodeType: "YulTypedName",
                src: "5971:7:7",
                type: "",
              },
            ],
            src: "5931:168:7",
          },
          {
            body: {
              nodeType: "YulBlock",
              src: "6152:77:7",
              statements: [
                {
                  nodeType: "YulAssignment",
                  src: "6162:16:7",
                  value: {
                    arguments: [
                      {
                        name: "x",
                        nodeType: "YulIdentifier",
                        src: "6173:1:7",
                      },
                      {
                        name: "y",
                        nodeType: "YulIdentifier",
                        src: "6176:1:7",
                      },
                    ],
                    functionName: {
                      name: "add",
                      nodeType: "YulIdentifier",
                      src: "6169:3:7",
                    },
                    nodeType: "YulFunctionCall",
                    src: "6169:9:7",
                  },
                  variableNames: [
                    {
                      name: "sum",
                      nodeType: "YulIdentifier",
                      src: "6162:3:7",
                    },
                  ],
                },
                {
                  body: {
                    nodeType: "YulBlock",
                    src: "6201:22:7",
                    statements: [
                      {
                        expression: {
                          arguments: [],
                          functionName: {
                            name: "panic_error_0x11",
                            nodeType: "YulIdentifier",
                            src: "6203:16:7",
                          },
                          nodeType: "YulFunctionCall",
                          src: "6203:18:7",
                        },
                        nodeType: "YulExpressionStatement",
                        src: "6203:18:7",
                      },
                    ],
                  },
                  condition: {
                    arguments: [
                      {
                        name: "x",
                        nodeType: "YulIdentifier",
                        src: "6193:1:7",
                      },
                      {
                        name: "sum",
                        nodeType: "YulIdentifier",
                        src: "6196:3:7",
                      },
                    ],
                    functionName: {
                      name: "gt",
                      nodeType: "YulIdentifier",
                      src: "6190:2:7",
                    },
                    nodeType: "YulFunctionCall",
                    src: "6190:10:7",
                  },
                  nodeType: "YulIf",
                  src: "6187:36:7",
                },
              ],
            },
            name: "checked_add_t_uint256",
            nodeType: "YulFunctionDefinition",
            parameters: [
              {
                name: "x",
                nodeType: "YulTypedName",
                src: "6135:1:7",
                type: "",
              },
              {
                name: "y",
                nodeType: "YulTypedName",
                src: "6138:1:7",
                type: "",
              },
            ],
            returnVariables: [
              {
                name: "sum",
                nodeType: "YulTypedName",
                src: "6144:3:7",
                type: "",
              },
            ],
            src: "6104:125:7",
          },
          {
            body: {
              nodeType: "YulBlock",
              src: "6391:188:7",
              statements: [
                {
                  nodeType: "YulAssignment",
                  src: "6401:26:7",
                  value: {
                    arguments: [
                      {
                        name: "headStart",
                        nodeType: "YulIdentifier",
                        src: "6413:9:7",
                      },
                      {
                        kind: "number",
                        nodeType: "YulLiteral",
                        src: "6424:2:7",
                        type: "",
                        value: "96",
                      },
                    ],
                    functionName: {
                      name: "add",
                      nodeType: "YulIdentifier",
                      src: "6409:3:7",
                    },
                    nodeType: "YulFunctionCall",
                    src: "6409:18:7",
                  },
                  variableNames: [
                    {
                      name: "tail",
                      nodeType: "YulIdentifier",
                      src: "6401:4:7",
                    },
                  ],
                },
                {
                  expression: {
                    arguments: [
                      {
                        name: "headStart",
                        nodeType: "YulIdentifier",
                        src: "6443:9:7",
                      },
                      {
                        arguments: [
                          {
                            name: "value0",
                            nodeType: "YulIdentifier",
                            src: "6458:6:7",
                          },
                          {
                            arguments: [
                              {
                                arguments: [
                                  {
                                    kind: "number",
                                    nodeType: "YulLiteral",
                                    src: "6474:3:7",
                                    type: "",
                                    value: "160",
                                  },
                                  {
                                    kind: "number",
                                    nodeType: "YulLiteral",
                                    src: "6479:1:7",
                                    type: "",
                                    value: "1",
                                  },
                                ],
                                functionName: {
                                  name: "shl",
                                  nodeType: "YulIdentifier",
                                  src: "6470:3:7",
                                },
                                nodeType: "YulFunctionCall",
                                src: "6470:11:7",
                              },
                              {
                                kind: "number",
                                nodeType: "YulLiteral",
                                src: "6483:1:7",
                                type: "",
                                value: "1",
                              },
                            ],
                            functionName: {
                              name: "sub",
                              nodeType: "YulIdentifier",
                              src: "6466:3:7",
                            },
                            nodeType: "YulFunctionCall",
                            src: "6466:19:7",
                          },
                        ],
                        functionName: {
                          name: "and",
                          nodeType: "YulIdentifier",
                          src: "6454:3:7",
                        },
                        nodeType: "YulFunctionCall",
                        src: "6454:32:7",
                      },
                    ],
                    functionName: {
                      name: "mstore",
                      nodeType: "YulIdentifier",
                      src: "6436:6:7",
                    },
                    nodeType: "YulFunctionCall",
                    src: "6436:51:7",
                  },
                  nodeType: "YulExpressionStatement",
                  src: "6436:51:7",
                },
                {
                  expression: {
                    arguments: [
                      {
                        arguments: [
                          {
                            name: "headStart",
                            nodeType: "YulIdentifier",
                            src: "6507:9:7",
                          },
                          {
                            kind: "number",
                            nodeType: "YulLiteral",
                            src: "6518:2:7",
                            type: "",
                            value: "32",
                          },
                        ],
                        functionName: {
                          name: "add",
                          nodeType: "YulIdentifier",
                          src: "6503:3:7",
                        },
                        nodeType: "YulFunctionCall",
                        src: "6503:18:7",
                      },
                      {
                        name: "value1",
                        nodeType: "YulIdentifier",
                        src: "6523:6:7",
                      },
                    ],
                    functionName: {
                      name: "mstore",
                      nodeType: "YulIdentifier",
                      src: "6496:6:7",
                    },
                    nodeType: "YulFunctionCall",
                    src: "6496:34:7",
                  },
                  nodeType: "YulExpressionStatement",
                  src: "6496:34:7",
                },
                {
                  expression: {
                    arguments: [
                      {
                        arguments: [
                          {
                            name: "headStart",
                            nodeType: "YulIdentifier",
                            src: "6550:9:7",
                          },
                          {
                            kind: "number",
                            nodeType: "YulLiteral",
                            src: "6561:2:7",
                            type: "",
                            value: "64",
                          },
                        ],
                        functionName: {
                          name: "add",
                          nodeType: "YulIdentifier",
                          src: "6546:3:7",
                        },
                        nodeType: "YulFunctionCall",
                        src: "6546:18:7",
                      },
                      {
                        name: "value2",
                        nodeType: "YulIdentifier",
                        src: "6566:6:7",
                      },
                    ],
                    functionName: {
                      name: "mstore",
                      nodeType: "YulIdentifier",
                      src: "6539:6:7",
                    },
                    nodeType: "YulFunctionCall",
                    src: "6539:34:7",
                  },
                  nodeType: "YulExpressionStatement",
                  src: "6539:34:7",
                },
              ],
            },
            name: "abi_encode_tuple_t_address_t_uint256_t_uint256__to_t_address_t_uint256_t_uint256__fromStack_reversed",
            nodeType: "YulFunctionDefinition",
            parameters: [
              {
                name: "headStart",
                nodeType: "YulTypedName",
                src: "6344:9:7",
                type: "",
              },
              {
                name: "value2",
                nodeType: "YulTypedName",
                src: "6355:6:7",
                type: "",
              },
              {
                name: "value1",
                nodeType: "YulTypedName",
                src: "6363:6:7",
                type: "",
              },
              {
                name: "value0",
                nodeType: "YulTypedName",
                src: "6371:6:7",
                type: "",
              },
            ],
            returnVariables: [
              {
                name: "tail",
                nodeType: "YulTypedName",
                src: "6382:4:7",
                type: "",
              },
            ],
            src: "6234:345:7",
          },
          {
            body: {
              nodeType: "YulBlock",
              src: "6685:76:7",
              statements: [
                {
                  nodeType: "YulAssignment",
                  src: "6695:26:7",
                  value: {
                    arguments: [
                      {
                        name: "headStart",
                        nodeType: "YulIdentifier",
                        src: "6707:9:7",
                      },
                      {
                        kind: "number",
                        nodeType: "YulLiteral",
                        src: "6718:2:7",
                        type: "",
                        value: "32",
                      },
                    ],
                    functionName: {
                      name: "add",
                      nodeType: "YulIdentifier",
                      src: "6703:3:7",
                    },
                    nodeType: "YulFunctionCall",
                    src: "6703:18:7",
                  },
                  variableNames: [
                    {
                      name: "tail",
                      nodeType: "YulIdentifier",
                      src: "6695:4:7",
                    },
                  ],
                },
                {
                  expression: {
                    arguments: [
                      {
                        name: "headStart",
                        nodeType: "YulIdentifier",
                        src: "6737:9:7",
                      },
                      {
                        name: "value0",
                        nodeType: "YulIdentifier",
                        src: "6748:6:7",
                      },
                    ],
                    functionName: {
                      name: "mstore",
                      nodeType: "YulIdentifier",
                      src: "6730:6:7",
                    },
                    nodeType: "YulFunctionCall",
                    src: "6730:25:7",
                  },
                  nodeType: "YulExpressionStatement",
                  src: "6730:25:7",
                },
              ],
            },
            name: "abi_encode_tuple_t_uint256__to_t_uint256__fromStack_reversed",
            nodeType: "YulFunctionDefinition",
            parameters: [
              {
                name: "headStart",
                nodeType: "YulTypedName",
                src: "6654:9:7",
                type: "",
              },
              {
                name: "value0",
                nodeType: "YulTypedName",
                src: "6665:6:7",
                type: "",
              },
            ],
            returnVariables: [
              {
                name: "tail",
                nodeType: "YulTypedName",
                src: "6676:4:7",
                type: "",
              },
            ],
            src: "6584:177:7",
          },
        ],
      },
      contents:
        "{\n    { }\n    function panic_error_0x41()\n    {\n        mstore(0, shl(224, 0x4e487b71))\n        mstore(4, 0x41)\n        revert(0, 0x24)\n    }\n    function abi_decode_string_fromMemory(offset, end) -> array\n    {\n        if iszero(slt(add(offset, 0x1f), end)) { revert(0, 0) }\n        let _1 := mload(offset)\n        let _2 := sub(shl(64, 1), 1)\n        if gt(_1, _2) { panic_error_0x41() }\n        let _3 := not(31)\n        let memPtr := mload(64)\n        let newFreePtr := add(memPtr, and(add(and(add(_1, 0x1f), _3), 63), _3))\n        if or(gt(newFreePtr, _2), lt(newFreePtr, memPtr)) { panic_error_0x41() }\n        mstore(64, newFreePtr)\n        mstore(memPtr, _1)\n        let _4 := 0x20\n        if gt(add(add(offset, _1), _4), end) { revert(0, 0) }\n        let i := 0\n        for { } lt(i, _1) { i := add(i, _4) }\n        {\n            mstore(add(add(memPtr, i), _4), mload(add(add(offset, i), _4)))\n        }\n        mstore(add(add(memPtr, _1), _4), 0)\n        array := memPtr\n    }\n    function abi_decode_tuple_t_string_memory_ptrt_string_memory_ptrt_uint256_fromMemory(headStart, dataEnd) -> value0, value1, value2\n    {\n        if slt(sub(dataEnd, headStart), 96) { revert(0, 0) }\n        let offset := mload(headStart)\n        let _1 := sub(shl(64, 1), 1)\n        if gt(offset, _1) { revert(0, 0) }\n        value0 := abi_decode_string_fromMemory(add(headStart, offset), dataEnd)\n        let offset_1 := mload(add(headStart, 32))\n        if gt(offset_1, _1) { revert(0, 0) }\n        value1 := abi_decode_string_fromMemory(add(headStart, offset_1), dataEnd)\n        value2 := mload(add(headStart, 64))\n    }\n    function extract_byte_array_length(data) -> length\n    {\n        length := shr(1, data)\n        let outOfPlaceEncoding := and(data, 1)\n        if iszero(outOfPlaceEncoding) { length := and(length, 0x7f) }\n        if eq(outOfPlaceEncoding, lt(length, 32))\n        {\n            mstore(0, shl(224, 0x4e487b71))\n            mstore(4, 0x22)\n            revert(0, 0x24)\n        }\n    }\n    function array_dataslot_string_storage(ptr) -> data\n    {\n        mstore(0, ptr)\n        data := keccak256(0, 0x20)\n    }\n    function clean_up_bytearray_end_slots_string_storage(array, len, startIndex)\n    {\n        if gt(len, 31)\n        {\n            let _1 := 0\n            mstore(_1, array)\n            let data := keccak256(_1, 0x20)\n            let deleteStart := add(data, shr(5, add(startIndex, 31)))\n            if lt(startIndex, 0x20) { deleteStart := data }\n            let _2 := add(data, shr(5, add(len, 31)))\n            let start := deleteStart\n            for { } lt(start, _2) { start := add(start, 1) }\n            { sstore(start, _1) }\n        }\n    }\n    function extract_used_part_and_set_length_of_short_byte_array(data, len) -> used\n    {\n        used := or(and(data, not(shr(shl(3, len), not(0)))), shl(1, len))\n    }\n    function copy_byte_array_to_storage_from_t_string_memory_ptr_to_t_string_storage(slot, src)\n    {\n        let newLen := mload(src)\n        if gt(newLen, sub(shl(64, 1), 1)) { panic_error_0x41() }\n        clean_up_bytearray_end_slots_string_storage(slot, extract_byte_array_length(sload(slot)), newLen)\n        let srcOffset := 0\n        let srcOffset_1 := 0x20\n        srcOffset := srcOffset_1\n        switch gt(newLen, 31)\n        case 1 {\n            let loopEnd := and(newLen, not(31))\n            let dstPtr := array_dataslot_string_storage(slot)\n            let i := 0\n            for { } lt(i, loopEnd) { i := add(i, srcOffset_1) }\n            {\n                sstore(dstPtr, mload(add(src, srcOffset)))\n                dstPtr := add(dstPtr, 1)\n                srcOffset := add(srcOffset, srcOffset_1)\n            }\n            if lt(loopEnd, newLen)\n            {\n                let lastValue := mload(add(src, srcOffset))\n                sstore(dstPtr, and(lastValue, not(shr(and(shl(3, newLen), 248), not(0)))))\n            }\n            sstore(slot, add(shl(1, newLen), 1))\n        }\n        default {\n            let value := 0\n            if newLen\n            {\n                value := mload(add(src, srcOffset))\n            }\n            sstore(slot, extract_used_part_and_set_length_of_short_byte_array(value, newLen))\n        }\n    }\n    function abi_encode_tuple_t_address__to_t_address__fromStack_reversed(headStart, value0) -> tail\n    {\n        tail := add(headStart, 32)\n        mstore(headStart, and(value0, sub(shl(160, 1), 1)))\n    }\n    function panic_error_0x11()\n    {\n        mstore(0, shl(224, 0x4e487b71))\n        mstore(4, 0x11)\n        revert(0, 0x24)\n    }\n    function checked_exp_helper(_base, exponent) -> power, base\n    {\n        let power_1 := 1\n        power := power_1\n        base := _base\n        for { } gt(exponent, power_1) { }\n        {\n            if gt(base, div(not(0), base)) { panic_error_0x11() }\n            if and(exponent, power_1) { power := mul(power, base) }\n            base := mul(base, base)\n            exponent := shr(power_1, exponent)\n        }\n    }\n    function checked_exp_unsigned(base, exponent) -> power\n    {\n        if iszero(exponent)\n        {\n            power := 1\n            leave\n        }\n        if iszero(base)\n        {\n            power := 0\n            leave\n        }\n        switch base\n        case 1 {\n            power := 1\n            leave\n        }\n        case 2 {\n            if gt(exponent, 255) { panic_error_0x11() }\n            power := shl(exponent, 1)\n            leave\n        }\n        if or(and(lt(base, 11), lt(exponent, 78)), and(lt(base, 307), lt(exponent, 32)))\n        {\n            power := exp(base, exponent)\n            leave\n        }\n        let power_1, base_1 := checked_exp_helper(base, exponent)\n        if gt(power_1, div(not(0), base_1)) { panic_error_0x11() }\n        power := mul(power_1, base_1)\n    }\n    function checked_exp_t_uint256_t_uint8(base, exponent) -> power\n    {\n        power := checked_exp_unsigned(base, and(exponent, 0xff))\n    }\n    function checked_mul_t_uint256(x, y) -> product\n    {\n        product := mul(x, y)\n        if iszero(or(iszero(x), eq(y, div(product, x)))) { panic_error_0x11() }\n    }\n    function checked_add_t_uint256(x, y) -> sum\n    {\n        sum := add(x, y)\n        if gt(x, sum) { panic_error_0x11() }\n    }\n    function abi_encode_tuple_t_address_t_uint256_t_uint256__to_t_address_t_uint256_t_uint256__fromStack_reversed(headStart, value2, value1, value0) -> tail\n    {\n        tail := add(headStart, 96)\n        mstore(headStart, and(value0, sub(shl(160, 1), 1)))\n        mstore(add(headStart, 32), value1)\n        mstore(add(headStart, 64), value2)\n    }\n    function abi_encode_tuple_t_uint256__to_t_uint256__fromStack_reversed(headStart, value0) -> tail\n    {\n        tail := add(headStart, 32)\n        mstore(headStart, value0)\n    }\n}",
      id: 7,
      language: "Yul",
      name: "#utility.yul",
    },
  ],
  linkReferences: {},
  object:
    "608060405234801562000010575f80fd5b5060405162000f8338038062000f83833981016040819052620000339162000339565b338383600362000044838262000433565b50600462000053828262000433565b5050506001600160a01b0381166200008557604051631e4fbdf760e01b81525f60048201526024015b60405180910390fd5b6200009081620000bf565b50620000b633620000a46012600a6200060a565b620000b0908462000621565b62000110565b50505062000651565b600580546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0905f90a35050565b6001600160a01b0382166200013b5760405163ec442f0560e01b81525f60048201526024016200007c565b620001485f83836200014c565b5050565b6001600160a01b0383166200017a578060025f8282546200016e91906200063b565b90915550620001ec9050565b6001600160a01b0383165f9081526020819052604090205481811015620001ce5760405163391434e360e21b81526001600160a01b038516600482015260248101829052604481018390526064016200007c565b6001600160a01b0384165f9081526020819052604090209082900390555b6001600160a01b0382166200020a5760028054829003905562000228565b6001600160a01b0382165f9081526020819052604090208054820190555b816001600160a01b0316836001600160a01b03167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef836040516200026e91815260200190565b60405180910390a3505050565b634e487b7160e01b5f52604160045260245ffd5b5f82601f8301126200029f575f80fd5b81516001600160401b0380821115620002bc57620002bc6200027b565b604051601f8301601f19908116603f01168101908282118183101715620002e757620002e76200027b565b8160405283815260209250868385880101111562000303575f80fd5b5f91505b8382101562000326578582018301518183018401529082019062000307565b5f93810190920192909252949350505050565b5f805f606084860312156200034c575f80fd5b83516001600160401b038082111562000363575f80fd5b62000371878388016200028f565b9450602086015191508082111562000387575f80fd5b5062000396868287016200028f565b925050604084015190509250925092565b600181811c90821680620003bc57607f821691505b602082108103620003db57634e487b7160e01b5f52602260045260245ffd5b50919050565b601f8211156200042e575f81815260208120601f850160051c81016020861015620004095750805b601f850160051c820191505b818110156200042a5782815560010162000415565b5050505b505050565b81516001600160401b038111156200044f576200044f6200027b565b6200046781620004608454620003a7565b84620003e1565b602080601f8311600181146200049d575f8415620004855750858301515b5f19600386901b1c1916600185901b1785556200042a565b5f85815260208120601f198616915b82811015620004cd57888601518255948401946001909101908401620004ac565b5085821015620004eb57878501515f19600388901b60f8161c191681555b5050505050600190811b01905550565b634e487b7160e01b5f52601160045260245ffd5b600181815b808511156200054f57815f1904821115620005335762000533620004fb565b808516156200054157918102915b93841c939080029062000514565b509250929050565b5f82620005675750600162000604565b816200057557505f62000604565b81600181146200058e57600281146200059957620005b9565b600191505062000604565b60ff841115620005ad57620005ad620004fb565b50506001821b62000604565b5060208310610133831016604e8410600b8410161715620005de575081810a62000604565b620005ea83836200050f565b805f1904821115620006005762000600620004fb565b0290505b92915050565b5f6200061a60ff84168362000557565b9392505050565b8082028115828204841417620006045762000604620004fb565b80820180821115620006045762000604620004fb565b610924806200065f5f395ff3fe608060405234801561000f575f80fd5b50600436106100e5575f3560e01c806370a082311161008857806395d89b411161006357806395d89b41146101d1578063a9059cbb146101d9578063dd62ed3e146101ec578063f2fde38b14610224575f80fd5b806370a0823114610186578063715018a6146101ae5780638da5cb5b146101b6575f80fd5b806323b872dd116100c357806323b872dd1461013c578063313ce5671461014f57806340c10f191461015e57806342966c6814610173575f80fd5b806306fdde03146100e9578063095ea7b31461010757806318160ddd1461012a575b5f80fd5b6100f1610237565b6040516100fe9190610768565b60405180910390f35b61011a6101153660046107ce565b6102c7565b60405190151581526020016100fe565b6002545b6040519081526020016100fe565b61011a61014a3660046107f6565b6102e0565b604051601281526020016100fe565b61017161016c3660046107ce565b610303565b005b61017161018136600461082f565b610319565b61012e610194366004610846565b6001600160a01b03165f9081526020819052604090205490565b610171610326565b6005546040516001600160a01b0390911681526020016100fe565b6100f1610338565b61011a6101e73660046107ce565b610347565b61012e6101fa366004610866565b6001600160a01b039182165f90815260016020908152604080832093909416825291909152205490565b610171610232366004610846565b610354565b60606003805461024690610897565b80601f016020809104026020016040519081016040528092919081815260200182805461027290610897565b80156102bd5780601f10610294576101008083540402835291602001916102bd565b820191905f5260205f20905b8154815290600101906020018083116102a057829003601f168201915b5050505050905090565b5f336102d4818585610393565b60019150505b92915050565b5f336102ed8582856103a5565b6102f8858585610420565b506001949350505050565b61030b61047d565b61031582826104aa565b5050565b61032333826104de565b50565b61032e61047d565b610336610512565b565b60606004805461024690610897565b5f336102d4818585610420565b61035c61047d565b6001600160a01b03811661038a57604051631e4fbdf760e01b81525f60048201526024015b60405180910390fd5b6103238161051f565b6103a08383836001610570565b505050565b6001600160a01b038381165f908152600160209081526040808320938616835292905220545f19811461041a578181101561040c57604051637dc7a0d960e11b81526001600160a01b03841660048201526024810182905260448101839052606401610381565b61041a84848484035f610570565b50505050565b6001600160a01b03831661044957604051634b637e8f60e11b81525f6004820152602401610381565b6001600160a01b0382166104725760405163ec442f0560e01b81525f6004820152602401610381565b6103a0838383610642565b6005546001600160a01b031633146103365760405163118cdaa760e01b8152336004820152602401610381565b6001600160a01b0382166104d35760405163ec442f0560e01b81525f6004820152602401610381565b6103155f8383610642565b6001600160a01b03821661050757604051634b637e8f60e11b81525f6004820152602401610381565b610315825f83610642565b61051a61047d565b6103365f5b600580546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0905f90a35050565b6001600160a01b0384166105995760405163e602df0560e01b81525f6004820152602401610381565b6001600160a01b0383166105c257604051634a1406b160e11b81525f6004820152602401610381565b6001600160a01b038085165f908152600160209081526040808320938716835292905220829055801561041a57826001600160a01b0316846001600160a01b03167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b9258460405161063491815260200190565b60405180910390a350505050565b6001600160a01b03831661066c578060025f82825461066191906108cf565b909155506106dc9050565b6001600160a01b0383165f90815260208190526040902054818110156106be5760405163391434e360e21b81526001600160a01b03851660048201526024810182905260448101839052606401610381565b6001600160a01b0384165f9081526020819052604090209082900390555b6001600160a01b0382166106f857600280548290039055610716565b6001600160a01b0382165f9081526020819052604090208054820190555b816001600160a01b0316836001600160a01b03167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef8360405161075b91815260200190565b60405180910390a3505050565b5f6020808352835180828501525f5b8181101561079357858101830151858201604001528201610777565b505f604082860101526040601f19601f8301168501019250505092915050565b80356001600160a01b03811681146107c9575f80fd5b919050565b5f80604083850312156107df575f80fd5b6107e8836107b3565b946020939093013593505050565b5f805f60608486031215610808575f80fd5b610811846107b3565b925061081f602085016107b3565b9150604084013590509250925092565b5f6020828403121561083f575f80fd5b5035919050565b5f60208284031215610856575f80fd5b61085f826107b3565b9392505050565b5f8060408385031215610877575f80fd5b610880836107b3565b915061088e602084016107b3565b90509250929050565b600181811c908216806108ab57607f821691505b6020821081036108c957634e487b7160e01b5f52602260045260245ffd5b50919050565b808201808211156102da57634e487b7160e01b5f52601160045260245ffdfea264697066735822122019e3a17792ac30fcb9dfdc54912155fdda51a595af9cc18955446055ddfcf95264736f6c63430008140033",
  opcodes:
    "PUSH1 0x80 PUSH1 0x40 MSTORE CALLVALUE DUP1 ISZERO PUSH3 0x10 JUMPI PUSH0 DUP1 REVERT JUMPDEST POP PUSH1 0x40 MLOAD PUSH3 0xF83 CODESIZE SUB DUP1 PUSH3 0xF83 DUP4 CODECOPY DUP2 ADD PUSH1 0x40 DUP2 SWAP1 MSTORE PUSH3 0x33 SWAP2 PUSH3 0x339 JUMP JUMPDEST CALLER DUP4 DUP4 PUSH1 0x3 PUSH3 0x44 DUP4 DUP3 PUSH3 0x433 JUMP JUMPDEST POP PUSH1 0x4 PUSH3 0x53 DUP3 DUP3 PUSH3 0x433 JUMP JUMPDEST POP POP POP PUSH1 0x1 PUSH1 0x1 PUSH1 0xA0 SHL SUB DUP2 AND PUSH3 0x85 JUMPI PUSH1 0x40 MLOAD PUSH4 0x1E4FBDF7 PUSH1 0xE0 SHL DUP2 MSTORE PUSH0 PUSH1 0x4 DUP3 ADD MSTORE PUSH1 0x24 ADD JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST PUSH3 0x90 DUP2 PUSH3 0xBF JUMP JUMPDEST POP PUSH3 0xB6 CALLER PUSH3 0xA4 PUSH1 0x12 PUSH1 0xA PUSH3 0x60A JUMP JUMPDEST PUSH3 0xB0 SWAP1 DUP5 PUSH3 0x621 JUMP JUMPDEST PUSH3 0x110 JUMP JUMPDEST POP POP POP PUSH3 0x651 JUMP JUMPDEST PUSH1 0x5 DUP1 SLOAD PUSH1 0x1 PUSH1 0x1 PUSH1 0xA0 SHL SUB DUP4 DUP2 AND PUSH1 0x1 PUSH1 0x1 PUSH1 0xA0 SHL SUB NOT DUP4 AND DUP2 OR SWAP1 SWAP4 SSTORE PUSH1 0x40 MLOAD SWAP2 AND SWAP2 SWAP1 DUP3 SWAP1 PUSH32 0x8BE0079C531659141344CD1FD0A4F28419497F9722A3DAAFE3B4186F6B6457E0 SWAP1 PUSH0 SWAP1 LOG3 POP POP JUMP JUMPDEST PUSH1 0x1 PUSH1 0x1 PUSH1 0xA0 SHL SUB DUP3 AND PUSH3 0x13B JUMPI PUSH1 0x40 MLOAD PUSH4 0xEC442F05 PUSH1 0xE0 SHL DUP2 MSTORE PUSH0 PUSH1 0x4 DUP3 ADD MSTORE PUSH1 0x24 ADD PUSH3 0x7C JUMP JUMPDEST PUSH3 0x148 PUSH0 DUP4 DUP4 PUSH3 0x14C JUMP JUMPDEST POP POP JUMP JUMPDEST PUSH1 0x1 PUSH1 0x1 PUSH1 0xA0 SHL SUB DUP4 AND PUSH3 0x17A JUMPI DUP1 PUSH1 0x2 PUSH0 DUP3 DUP3 SLOAD PUSH3 0x16E SWAP2 SWAP1 PUSH3 0x63B JUMP JUMPDEST SWAP1 SWAP2 SSTORE POP PUSH3 0x1EC SWAP1 POP JUMP JUMPDEST PUSH1 0x1 PUSH1 0x1 PUSH1 0xA0 SHL SUB DUP4 AND PUSH0 SWAP1 DUP2 MSTORE PUSH1 0x20 DUP2 SWAP1 MSTORE PUSH1 0x40 SWAP1 KECCAK256 SLOAD DUP2 DUP2 LT ISZERO PUSH3 0x1CE JUMPI PUSH1 0x40 MLOAD PUSH4 0x391434E3 PUSH1 0xE2 SHL DUP2 MSTORE PUSH1 0x1 PUSH1 0x1 PUSH1 0xA0 SHL SUB DUP6 AND PUSH1 0x4 DUP3 ADD MSTORE PUSH1 0x24 DUP2 ADD DUP3 SWAP1 MSTORE PUSH1 0x44 DUP2 ADD DUP4 SWAP1 MSTORE PUSH1 0x64 ADD PUSH3 0x7C JUMP JUMPDEST PUSH1 0x1 PUSH1 0x1 PUSH1 0xA0 SHL SUB DUP5 AND PUSH0 SWAP1 DUP2 MSTORE PUSH1 0x20 DUP2 SWAP1 MSTORE PUSH1 0x40 SWAP1 KECCAK256 SWAP1 DUP3 SWAP1 SUB SWAP1 SSTORE JUMPDEST PUSH1 0x1 PUSH1 0x1 PUSH1 0xA0 SHL SUB DUP3 AND PUSH3 0x20A JUMPI PUSH1 0x2 DUP1 SLOAD DUP3 SWAP1 SUB SWAP1 SSTORE PUSH3 0x228 JUMP JUMPDEST PUSH1 0x1 PUSH1 0x1 PUSH1 0xA0 SHL SUB DUP3 AND PUSH0 SWAP1 DUP2 MSTORE PUSH1 0x20 DUP2 SWAP1 MSTORE PUSH1 0x40 SWAP1 KECCAK256 DUP1 SLOAD DUP3 ADD SWAP1 SSTORE JUMPDEST DUP2 PUSH1 0x1 PUSH1 0x1 PUSH1 0xA0 SHL SUB AND DUP4 PUSH1 0x1 PUSH1 0x1 PUSH1 0xA0 SHL SUB AND PUSH32 0xDDF252AD1BE2C89B69C2B068FC378DAA952BA7F163C4A11628F55A4DF523B3EF DUP4 PUSH1 0x40 MLOAD PUSH3 0x26E SWAP2 DUP2 MSTORE PUSH1 0x20 ADD SWAP1 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 LOG3 POP POP POP JUMP JUMPDEST PUSH4 0x4E487B71 PUSH1 0xE0 SHL PUSH0 MSTORE PUSH1 0x41 PUSH1 0x4 MSTORE PUSH1 0x24 PUSH0 REVERT JUMPDEST PUSH0 DUP3 PUSH1 0x1F DUP4 ADD SLT PUSH3 0x29F JUMPI PUSH0 DUP1 REVERT JUMPDEST DUP2 MLOAD PUSH1 0x1 PUSH1 0x1 PUSH1 0x40 SHL SUB DUP1 DUP3 GT ISZERO PUSH3 0x2BC JUMPI PUSH3 0x2BC PUSH3 0x27B JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH1 0x1F DUP4 ADD PUSH1 0x1F NOT SWAP1 DUP2 AND PUSH1 0x3F ADD AND DUP2 ADD SWAP1 DUP3 DUP3 GT DUP2 DUP4 LT OR ISZERO PUSH3 0x2E7 JUMPI PUSH3 0x2E7 PUSH3 0x27B JUMP JUMPDEST DUP2 PUSH1 0x40 MSTORE DUP4 DUP2 MSTORE PUSH1 0x20 SWAP3 POP DUP7 DUP4 DUP6 DUP9 ADD ADD GT ISZERO PUSH3 0x303 JUMPI PUSH0 DUP1 REVERT JUMPDEST PUSH0 SWAP2 POP JUMPDEST DUP4 DUP3 LT ISZERO PUSH3 0x326 JUMPI DUP6 DUP3 ADD DUP4 ADD MLOAD DUP2 DUP4 ADD DUP5 ADD MSTORE SWAP1 DUP3 ADD SWAP1 PUSH3 0x307 JUMP JUMPDEST PUSH0 SWAP4 DUP2 ADD SWAP1 SWAP3 ADD SWAP3 SWAP1 SWAP3 MSTORE SWAP5 SWAP4 POP POP POP POP JUMP JUMPDEST PUSH0 DUP1 PUSH0 PUSH1 0x60 DUP5 DUP7 SUB SLT ISZERO PUSH3 0x34C JUMPI PUSH0 DUP1 REVERT JUMPDEST DUP4 MLOAD PUSH1 0x1 PUSH1 0x1 PUSH1 0x40 SHL SUB DUP1 DUP3 GT ISZERO PUSH3 0x363 JUMPI PUSH0 DUP1 REVERT JUMPDEST PUSH3 0x371 DUP8 DUP4 DUP9 ADD PUSH3 0x28F JUMP JUMPDEST SWAP5 POP PUSH1 0x20 DUP7 ADD MLOAD SWAP2 POP DUP1 DUP3 GT ISZERO PUSH3 0x387 JUMPI PUSH0 DUP1 REVERT JUMPDEST POP PUSH3 0x396 DUP7 DUP3 DUP8 ADD PUSH3 0x28F JUMP JUMPDEST SWAP3 POP POP PUSH1 0x40 DUP5 ADD MLOAD SWAP1 POP SWAP3 POP SWAP3 POP SWAP3 JUMP JUMPDEST PUSH1 0x1 DUP2 DUP2 SHR SWAP1 DUP3 AND DUP1 PUSH3 0x3BC JUMPI PUSH1 0x7F DUP3 AND SWAP2 POP JUMPDEST PUSH1 0x20 DUP3 LT DUP2 SUB PUSH3 0x3DB JUMPI PUSH4 0x4E487B71 PUSH1 0xE0 SHL PUSH0 MSTORE PUSH1 0x22 PUSH1 0x4 MSTORE PUSH1 0x24 PUSH0 REVERT JUMPDEST POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x1F DUP3 GT ISZERO PUSH3 0x42E JUMPI PUSH0 DUP2 DUP2 MSTORE PUSH1 0x20 DUP2 KECCAK256 PUSH1 0x1F DUP6 ADD PUSH1 0x5 SHR DUP2 ADD PUSH1 0x20 DUP7 LT ISZERO PUSH3 0x409 JUMPI POP DUP1 JUMPDEST PUSH1 0x1F DUP6 ADD PUSH1 0x5 SHR DUP3 ADD SWAP2 POP JUMPDEST DUP2 DUP2 LT ISZERO PUSH3 0x42A JUMPI DUP3 DUP2 SSTORE PUSH1 0x1 ADD PUSH3 0x415 JUMP JUMPDEST POP POP POP JUMPDEST POP POP POP JUMP JUMPDEST DUP2 MLOAD PUSH1 0x1 PUSH1 0x1 PUSH1 0x40 SHL SUB DUP2 GT ISZERO PUSH3 0x44F JUMPI PUSH3 0x44F PUSH3 0x27B JUMP JUMPDEST PUSH3 0x467 DUP2 PUSH3 0x460 DUP5 SLOAD PUSH3 0x3A7 JUMP JUMPDEST DUP5 PUSH3 0x3E1 JUMP JUMPDEST PUSH1 0x20 DUP1 PUSH1 0x1F DUP4 GT PUSH1 0x1 DUP2 EQ PUSH3 0x49D JUMPI PUSH0 DUP5 ISZERO PUSH3 0x485 JUMPI POP DUP6 DUP4 ADD MLOAD JUMPDEST PUSH0 NOT PUSH1 0x3 DUP7 SWAP1 SHL SHR NOT AND PUSH1 0x1 DUP6 SWAP1 SHL OR DUP6 SSTORE PUSH3 0x42A JUMP JUMPDEST PUSH0 DUP6 DUP2 MSTORE PUSH1 0x20 DUP2 KECCAK256 PUSH1 0x1F NOT DUP7 AND SWAP2 JUMPDEST DUP3 DUP2 LT ISZERO PUSH3 0x4CD JUMPI DUP9 DUP7 ADD MLOAD DUP3 SSTORE SWAP5 DUP5 ADD SWAP5 PUSH1 0x1 SWAP1 SWAP2 ADD SWAP1 DUP5 ADD PUSH3 0x4AC JUMP JUMPDEST POP DUP6 DUP3 LT ISZERO PUSH3 0x4EB JUMPI DUP8 DUP6 ADD MLOAD PUSH0 NOT PUSH1 0x3 DUP9 SWAP1 SHL PUSH1 0xF8 AND SHR NOT AND DUP2 SSTORE JUMPDEST POP POP POP POP POP PUSH1 0x1 SWAP1 DUP2 SHL ADD SWAP1 SSTORE POP JUMP JUMPDEST PUSH4 0x4E487B71 PUSH1 0xE0 SHL PUSH0 MSTORE PUSH1 0x11 PUSH1 0x4 MSTORE PUSH1 0x24 PUSH0 REVERT JUMPDEST PUSH1 0x1 DUP2 DUP2 JUMPDEST DUP1 DUP6 GT ISZERO PUSH3 0x54F JUMPI DUP2 PUSH0 NOT DIV DUP3 GT ISZERO PUSH3 0x533 JUMPI PUSH3 0x533 PUSH3 0x4FB JUMP JUMPDEST DUP1 DUP6 AND ISZERO PUSH3 0x541 JUMPI SWAP2 DUP2 MUL SWAP2 JUMPDEST SWAP4 DUP5 SHR SWAP4 SWAP1 DUP1 MUL SWAP1 PUSH3 0x514 JUMP JUMPDEST POP SWAP3 POP SWAP3 SWAP1 POP JUMP JUMPDEST PUSH0 DUP3 PUSH3 0x567 JUMPI POP PUSH1 0x1 PUSH3 0x604 JUMP JUMPDEST DUP2 PUSH3 0x575 JUMPI POP PUSH0 PUSH3 0x604 JUMP JUMPDEST DUP2 PUSH1 0x1 DUP2 EQ PUSH3 0x58E JUMPI PUSH1 0x2 DUP2 EQ PUSH3 0x599 JUMPI PUSH3 0x5B9 JUMP JUMPDEST PUSH1 0x1 SWAP2 POP POP PUSH3 0x604 JUMP JUMPDEST PUSH1 0xFF DUP5 GT ISZERO PUSH3 0x5AD JUMPI PUSH3 0x5AD PUSH3 0x4FB JUMP JUMPDEST POP POP PUSH1 0x1 DUP3 SHL PUSH3 0x604 JUMP JUMPDEST POP PUSH1 0x20 DUP4 LT PUSH2 0x133 DUP4 LT AND PUSH1 0x4E DUP5 LT PUSH1 0xB DUP5 LT AND OR ISZERO PUSH3 0x5DE JUMPI POP DUP2 DUP2 EXP PUSH3 0x604 JUMP JUMPDEST PUSH3 0x5EA DUP4 DUP4 PUSH3 0x50F JUMP JUMPDEST DUP1 PUSH0 NOT DIV DUP3 GT ISZERO PUSH3 0x600 JUMPI PUSH3 0x600 PUSH3 0x4FB JUMP JUMPDEST MUL SWAP1 POP JUMPDEST SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH0 PUSH3 0x61A PUSH1 0xFF DUP5 AND DUP4 PUSH3 0x557 JUMP JUMPDEST SWAP4 SWAP3 POP POP POP JUMP JUMPDEST DUP1 DUP3 MUL DUP2 ISZERO DUP3 DUP3 DIV DUP5 EQ OR PUSH3 0x604 JUMPI PUSH3 0x604 PUSH3 0x4FB JUMP JUMPDEST DUP1 DUP3 ADD DUP1 DUP3 GT ISZERO PUSH3 0x604 JUMPI PUSH3 0x604 PUSH3 0x4FB JUMP JUMPDEST PUSH2 0x924 DUP1 PUSH3 0x65F PUSH0 CODECOPY PUSH0 RETURN INVALID PUSH1 0x80 PUSH1 0x40 MSTORE CALLVALUE DUP1 ISZERO PUSH2 0xF JUMPI PUSH0 DUP1 REVERT JUMPDEST POP PUSH1 0x4 CALLDATASIZE LT PUSH2 0xE5 JUMPI PUSH0 CALLDATALOAD PUSH1 0xE0 SHR DUP1 PUSH4 0x70A08231 GT PUSH2 0x88 JUMPI DUP1 PUSH4 0x95D89B41 GT PUSH2 0x63 JUMPI DUP1 PUSH4 0x95D89B41 EQ PUSH2 0x1D1 JUMPI DUP1 PUSH4 0xA9059CBB EQ PUSH2 0x1D9 JUMPI DUP1 PUSH4 0xDD62ED3E EQ PUSH2 0x1EC JUMPI DUP1 PUSH4 0xF2FDE38B EQ PUSH2 0x224 JUMPI PUSH0 DUP1 REVERT JUMPDEST DUP1 PUSH4 0x70A08231 EQ PUSH2 0x186 JUMPI DUP1 PUSH4 0x715018A6 EQ PUSH2 0x1AE JUMPI DUP1 PUSH4 0x8DA5CB5B EQ PUSH2 0x1B6 JUMPI PUSH0 DUP1 REVERT JUMPDEST DUP1 PUSH4 0x23B872DD GT PUSH2 0xC3 JUMPI DUP1 PUSH4 0x23B872DD EQ PUSH2 0x13C JUMPI DUP1 PUSH4 0x313CE567 EQ PUSH2 0x14F JUMPI DUP1 PUSH4 0x40C10F19 EQ PUSH2 0x15E JUMPI DUP1 PUSH4 0x42966C68 EQ PUSH2 0x173 JUMPI PUSH0 DUP1 REVERT JUMPDEST DUP1 PUSH4 0x6FDDE03 EQ PUSH2 0xE9 JUMPI DUP1 PUSH4 0x95EA7B3 EQ PUSH2 0x107 JUMPI DUP1 PUSH4 0x18160DDD EQ PUSH2 0x12A JUMPI JUMPDEST PUSH0 DUP1 REVERT JUMPDEST PUSH2 0xF1 PUSH2 0x237 JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH2 0xFE SWAP2 SWAP1 PUSH2 0x768 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST PUSH2 0x11A PUSH2 0x115 CALLDATASIZE PUSH1 0x4 PUSH2 0x7CE JUMP JUMPDEST PUSH2 0x2C7 JUMP JUMPDEST PUSH1 0x40 MLOAD SWAP1 ISZERO ISZERO DUP2 MSTORE PUSH1 0x20 ADD PUSH2 0xFE JUMP JUMPDEST PUSH1 0x2 SLOAD JUMPDEST PUSH1 0x40 MLOAD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH2 0xFE JUMP JUMPDEST PUSH2 0x11A PUSH2 0x14A CALLDATASIZE PUSH1 0x4 PUSH2 0x7F6 JUMP JUMPDEST PUSH2 0x2E0 JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH1 0x12 DUP2 MSTORE PUSH1 0x20 ADD PUSH2 0xFE JUMP JUMPDEST PUSH2 0x171 PUSH2 0x16C CALLDATASIZE PUSH1 0x4 PUSH2 0x7CE JUMP JUMPDEST PUSH2 0x303 JUMP JUMPDEST STOP JUMPDEST PUSH2 0x171 PUSH2 0x181 CALLDATASIZE PUSH1 0x4 PUSH2 0x82F JUMP JUMPDEST PUSH2 0x319 JUMP JUMPDEST PUSH2 0x12E PUSH2 0x194 CALLDATASIZE PUSH1 0x4 PUSH2 0x846 JUMP JUMPDEST PUSH1 0x1 PUSH1 0x1 PUSH1 0xA0 SHL SUB AND PUSH0 SWAP1 DUP2 MSTORE PUSH1 0x20 DUP2 SWAP1 MSTORE PUSH1 0x40 SWAP1 KECCAK256 SLOAD SWAP1 JUMP JUMPDEST PUSH2 0x171 PUSH2 0x326 JUMP JUMPDEST PUSH1 0x5 SLOAD PUSH1 0x40 MLOAD PUSH1 0x1 PUSH1 0x1 PUSH1 0xA0 SHL SUB SWAP1 SWAP2 AND DUP2 MSTORE PUSH1 0x20 ADD PUSH2 0xFE JUMP JUMPDEST PUSH2 0xF1 PUSH2 0x338 JUMP JUMPDEST PUSH2 0x11A PUSH2 0x1E7 CALLDATASIZE PUSH1 0x4 PUSH2 0x7CE JUMP JUMPDEST PUSH2 0x347 JUMP JUMPDEST PUSH2 0x12E PUSH2 0x1FA CALLDATASIZE PUSH1 0x4 PUSH2 0x866 JUMP JUMPDEST PUSH1 0x1 PUSH1 0x1 PUSH1 0xA0 SHL SUB SWAP2 DUP3 AND PUSH0 SWAP1 DUP2 MSTORE PUSH1 0x1 PUSH1 0x20 SWAP1 DUP2 MSTORE PUSH1 0x40 DUP1 DUP4 KECCAK256 SWAP4 SWAP1 SWAP5 AND DUP3 MSTORE SWAP2 SWAP1 SWAP2 MSTORE KECCAK256 SLOAD SWAP1 JUMP JUMPDEST PUSH2 0x171 PUSH2 0x232 CALLDATASIZE PUSH1 0x4 PUSH2 0x846 JUMP JUMPDEST PUSH2 0x354 JUMP JUMPDEST PUSH1 0x60 PUSH1 0x3 DUP1 SLOAD PUSH2 0x246 SWAP1 PUSH2 0x897 JUMP JUMPDEST DUP1 PUSH1 0x1F ADD PUSH1 0x20 DUP1 SWAP2 DIV MUL PUSH1 0x20 ADD PUSH1 0x40 MLOAD SWAP1 DUP2 ADD PUSH1 0x40 MSTORE DUP1 SWAP3 SWAP2 SWAP1 DUP2 DUP2 MSTORE PUSH1 0x20 ADD DUP3 DUP1 SLOAD PUSH2 0x272 SWAP1 PUSH2 0x897 JUMP JUMPDEST DUP1 ISZERO PUSH2 0x2BD JUMPI DUP1 PUSH1 0x1F LT PUSH2 0x294 JUMPI PUSH2 0x100 DUP1 DUP4 SLOAD DIV MUL DUP4 MSTORE SWAP2 PUSH1 0x20 ADD SWAP2 PUSH2 0x2BD JUMP JUMPDEST DUP3 ADD SWAP2 SWAP1 PUSH0 MSTORE PUSH1 0x20 PUSH0 KECCAK256 SWAP1 JUMPDEST DUP2 SLOAD DUP2 MSTORE SWAP1 PUSH1 0x1 ADD SWAP1 PUSH1 0x20 ADD DUP1 DUP4 GT PUSH2 0x2A0 JUMPI DUP3 SWAP1 SUB PUSH1 0x1F AND DUP3 ADD SWAP2 JUMPDEST POP POP POP POP POP SWAP1 POP SWAP1 JUMP JUMPDEST PUSH0 CALLER PUSH2 0x2D4 DUP2 DUP6 DUP6 PUSH2 0x393 JUMP JUMPDEST PUSH1 0x1 SWAP2 POP POP JUMPDEST SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH0 CALLER PUSH2 0x2ED DUP6 DUP3 DUP6 PUSH2 0x3A5 JUMP JUMPDEST PUSH2 0x2F8 DUP6 DUP6 DUP6 PUSH2 0x420 JUMP JUMPDEST POP PUSH1 0x1 SWAP5 SWAP4 POP POP POP POP JUMP JUMPDEST PUSH2 0x30B PUSH2 0x47D JUMP JUMPDEST PUSH2 0x315 DUP3 DUP3 PUSH2 0x4AA JUMP JUMPDEST POP POP JUMP JUMPDEST PUSH2 0x323 CALLER DUP3 PUSH2 0x4DE JUMP JUMPDEST POP JUMP JUMPDEST PUSH2 0x32E PUSH2 0x47D JUMP JUMPDEST PUSH2 0x336 PUSH2 0x512 JUMP JUMPDEST JUMP JUMPDEST PUSH1 0x60 PUSH1 0x4 DUP1 SLOAD PUSH2 0x246 SWAP1 PUSH2 0x897 JUMP JUMPDEST PUSH0 CALLER PUSH2 0x2D4 DUP2 DUP6 DUP6 PUSH2 0x420 JUMP JUMPDEST PUSH2 0x35C PUSH2 0x47D JUMP JUMPDEST PUSH1 0x1 PUSH1 0x1 PUSH1 0xA0 SHL SUB DUP2 AND PUSH2 0x38A JUMPI PUSH1 0x40 MLOAD PUSH4 0x1E4FBDF7 PUSH1 0xE0 SHL DUP2 MSTORE PUSH0 PUSH1 0x4 DUP3 ADD MSTORE PUSH1 0x24 ADD JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST PUSH2 0x323 DUP2 PUSH2 0x51F JUMP JUMPDEST PUSH2 0x3A0 DUP4 DUP4 DUP4 PUSH1 0x1 PUSH2 0x570 JUMP JUMPDEST POP POP POP JUMP JUMPDEST PUSH1 0x1 PUSH1 0x1 PUSH1 0xA0 SHL SUB DUP4 DUP2 AND PUSH0 SWAP1 DUP2 MSTORE PUSH1 0x1 PUSH1 0x20 SWAP1 DUP2 MSTORE PUSH1 0x40 DUP1 DUP4 KECCAK256 SWAP4 DUP7 AND DUP4 MSTORE SWAP3 SWAP1 MSTORE KECCAK256 SLOAD PUSH0 NOT DUP2 EQ PUSH2 0x41A JUMPI DUP2 DUP2 LT ISZERO PUSH2 0x40C JUMPI PUSH1 0x40 MLOAD PUSH4 0x7DC7A0D9 PUSH1 0xE1 SHL DUP2 MSTORE PUSH1 0x1 PUSH1 0x1 PUSH1 0xA0 SHL SUB DUP5 AND PUSH1 0x4 DUP3 ADD MSTORE PUSH1 0x24 DUP2 ADD DUP3 SWAP1 MSTORE PUSH1 0x44 DUP2 ADD DUP4 SWAP1 MSTORE PUSH1 0x64 ADD PUSH2 0x381 JUMP JUMPDEST PUSH2 0x41A DUP5 DUP5 DUP5 DUP5 SUB PUSH0 PUSH2 0x570 JUMP JUMPDEST POP POP POP POP JUMP JUMPDEST PUSH1 0x1 PUSH1 0x1 PUSH1 0xA0 SHL SUB DUP4 AND PUSH2 0x449 JUMPI PUSH1 0x40 MLOAD PUSH4 0x4B637E8F PUSH1 0xE1 SHL DUP2 MSTORE PUSH0 PUSH1 0x4 DUP3 ADD MSTORE PUSH1 0x24 ADD PUSH2 0x381 JUMP JUMPDEST PUSH1 0x1 PUSH1 0x1 PUSH1 0xA0 SHL SUB DUP3 AND PUSH2 0x472 JUMPI PUSH1 0x40 MLOAD PUSH4 0xEC442F05 PUSH1 0xE0 SHL DUP2 MSTORE PUSH0 PUSH1 0x4 DUP3 ADD MSTORE PUSH1 0x24 ADD PUSH2 0x381 JUMP JUMPDEST PUSH2 0x3A0 DUP4 DUP4 DUP4 PUSH2 0x642 JUMP JUMPDEST PUSH1 0x5 SLOAD PUSH1 0x1 PUSH1 0x1 PUSH1 0xA0 SHL SUB AND CALLER EQ PUSH2 0x336 JUMPI PUSH1 0x40 MLOAD PUSH4 0x118CDAA7 PUSH1 0xE0 SHL DUP2 MSTORE CALLER PUSH1 0x4 DUP3 ADD MSTORE PUSH1 0x24 ADD PUSH2 0x381 JUMP JUMPDEST PUSH1 0x1 PUSH1 0x1 PUSH1 0xA0 SHL SUB DUP3 AND PUSH2 0x4D3 JUMPI PUSH1 0x40 MLOAD PUSH4 0xEC442F05 PUSH1 0xE0 SHL DUP2 MSTORE PUSH0 PUSH1 0x4 DUP3 ADD MSTORE PUSH1 0x24 ADD PUSH2 0x381 JUMP JUMPDEST PUSH2 0x315 PUSH0 DUP4 DUP4 PUSH2 0x642 JUMP JUMPDEST PUSH1 0x1 PUSH1 0x1 PUSH1 0xA0 SHL SUB DUP3 AND PUSH2 0x507 JUMPI PUSH1 0x40 MLOAD PUSH4 0x4B637E8F PUSH1 0xE1 SHL DUP2 MSTORE PUSH0 PUSH1 0x4 DUP3 ADD MSTORE PUSH1 0x24 ADD PUSH2 0x381 JUMP JUMPDEST PUSH2 0x315 DUP3 PUSH0 DUP4 PUSH2 0x642 JUMP JUMPDEST PUSH2 0x51A PUSH2 0x47D JUMP JUMPDEST PUSH2 0x336 PUSH0 JUMPDEST PUSH1 0x5 DUP1 SLOAD PUSH1 0x1 PUSH1 0x1 PUSH1 0xA0 SHL SUB DUP4 DUP2 AND PUSH1 0x1 PUSH1 0x1 PUSH1 0xA0 SHL SUB NOT DUP4 AND DUP2 OR SWAP1 SWAP4 SSTORE PUSH1 0x40 MLOAD SWAP2 AND SWAP2 SWAP1 DUP3 SWAP1 PUSH32 0x8BE0079C531659141344CD1FD0A4F28419497F9722A3DAAFE3B4186F6B6457E0 SWAP1 PUSH0 SWAP1 LOG3 POP POP JUMP JUMPDEST PUSH1 0x1 PUSH1 0x1 PUSH1 0xA0 SHL SUB DUP5 AND PUSH2 0x599 JUMPI PUSH1 0x40 MLOAD PUSH4 0xE602DF05 PUSH1 0xE0 SHL DUP2 MSTORE PUSH0 PUSH1 0x4 DUP3 ADD MSTORE PUSH1 0x24 ADD PUSH2 0x381 JUMP JUMPDEST PUSH1 0x1 PUSH1 0x1 PUSH1 0xA0 SHL SUB DUP4 AND PUSH2 0x5C2 JUMPI PUSH1 0x40 MLOAD PUSH4 0x4A1406B1 PUSH1 0xE1 SHL DUP2 MSTORE PUSH0 PUSH1 0x4 DUP3 ADD MSTORE PUSH1 0x24 ADD PUSH2 0x381 JUMP JUMPDEST PUSH1 0x1 PUSH1 0x1 PUSH1 0xA0 SHL SUB DUP1 DUP6 AND PUSH0 SWAP1 DUP2 MSTORE PUSH1 0x1 PUSH1 0x20 SWAP1 DUP2 MSTORE PUSH1 0x40 DUP1 DUP4 KECCAK256 SWAP4 DUP8 AND DUP4 MSTORE SWAP3 SWAP1 MSTORE KECCAK256 DUP3 SWAP1 SSTORE DUP1 ISZERO PUSH2 0x41A JUMPI DUP3 PUSH1 0x1 PUSH1 0x1 PUSH1 0xA0 SHL SUB AND DUP5 PUSH1 0x1 PUSH1 0x1 PUSH1 0xA0 SHL SUB AND PUSH32 0x8C5BE1E5EBEC7D5BD14F71427D1E84F3DD0314C0F7B2291E5B200AC8C7C3B925 DUP5 PUSH1 0x40 MLOAD PUSH2 0x634 SWAP2 DUP2 MSTORE PUSH1 0x20 ADD SWAP1 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 LOG3 POP POP POP POP JUMP JUMPDEST PUSH1 0x1 PUSH1 0x1 PUSH1 0xA0 SHL SUB DUP4 AND PUSH2 0x66C JUMPI DUP1 PUSH1 0x2 PUSH0 DUP3 DUP3 SLOAD PUSH2 0x661 SWAP2 SWAP1 PUSH2 0x8CF JUMP JUMPDEST SWAP1 SWAP2 SSTORE POP PUSH2 0x6DC SWAP1 POP JUMP JUMPDEST PUSH1 0x1 PUSH1 0x1 PUSH1 0xA0 SHL SUB DUP4 AND PUSH0 SWAP1 DUP2 MSTORE PUSH1 0x20 DUP2 SWAP1 MSTORE PUSH1 0x40 SWAP1 KECCAK256 SLOAD DUP2 DUP2 LT ISZERO PUSH2 0x6BE JUMPI PUSH1 0x40 MLOAD PUSH4 0x391434E3 PUSH1 0xE2 SHL DUP2 MSTORE PUSH1 0x1 PUSH1 0x1 PUSH1 0xA0 SHL SUB DUP6 AND PUSH1 0x4 DUP3 ADD MSTORE PUSH1 0x24 DUP2 ADD DUP3 SWAP1 MSTORE PUSH1 0x44 DUP2 ADD DUP4 SWAP1 MSTORE PUSH1 0x64 ADD PUSH2 0x381 JUMP JUMPDEST PUSH1 0x1 PUSH1 0x1 PUSH1 0xA0 SHL SUB DUP5 AND PUSH0 SWAP1 DUP2 MSTORE PUSH1 0x20 DUP2 SWAP1 MSTORE PUSH1 0x40 SWAP1 KECCAK256 SWAP1 DUP3 SWAP1 SUB SWAP1 SSTORE JUMPDEST PUSH1 0x1 PUSH1 0x1 PUSH1 0xA0 SHL SUB DUP3 AND PUSH2 0x6F8 JUMPI PUSH1 0x2 DUP1 SLOAD DUP3 SWAP1 SUB SWAP1 SSTORE PUSH2 0x716 JUMP JUMPDEST PUSH1 0x1 PUSH1 0x1 PUSH1 0xA0 SHL SUB DUP3 AND PUSH0 SWAP1 DUP2 MSTORE PUSH1 0x20 DUP2 SWAP1 MSTORE PUSH1 0x40 SWAP1 KECCAK256 DUP1 SLOAD DUP3 ADD SWAP1 SSTORE JUMPDEST DUP2 PUSH1 0x1 PUSH1 0x1 PUSH1 0xA0 SHL SUB AND DUP4 PUSH1 0x1 PUSH1 0x1 PUSH1 0xA0 SHL SUB AND PUSH32 0xDDF252AD1BE2C89B69C2B068FC378DAA952BA7F163C4A11628F55A4DF523B3EF DUP4 PUSH1 0x40 MLOAD PUSH2 0x75B SWAP2 DUP2 MSTORE PUSH1 0x20 ADD SWAP1 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 LOG3 POP POP POP JUMP JUMPDEST PUSH0 PUSH1 0x20 DUP1 DUP4 MSTORE DUP4 MLOAD DUP1 DUP3 DUP6 ADD MSTORE PUSH0 JUMPDEST DUP2 DUP2 LT ISZERO PUSH2 0x793 JUMPI DUP6 DUP2 ADD DUP4 ADD MLOAD DUP6 DUP3 ADD PUSH1 0x40 ADD MSTORE DUP3 ADD PUSH2 0x777 JUMP JUMPDEST POP PUSH0 PUSH1 0x40 DUP3 DUP7 ADD ADD MSTORE PUSH1 0x40 PUSH1 0x1F NOT PUSH1 0x1F DUP4 ADD AND DUP6 ADD ADD SWAP3 POP POP POP SWAP3 SWAP2 POP POP JUMP JUMPDEST DUP1 CALLDATALOAD PUSH1 0x1 PUSH1 0x1 PUSH1 0xA0 SHL SUB DUP2 AND DUP2 EQ PUSH2 0x7C9 JUMPI PUSH0 DUP1 REVERT JUMPDEST SWAP2 SWAP1 POP JUMP JUMPDEST PUSH0 DUP1 PUSH1 0x40 DUP4 DUP6 SUB SLT ISZERO PUSH2 0x7DF JUMPI PUSH0 DUP1 REVERT JUMPDEST PUSH2 0x7E8 DUP4 PUSH2 0x7B3 JUMP JUMPDEST SWAP5 PUSH1 0x20 SWAP4 SWAP1 SWAP4 ADD CALLDATALOAD SWAP4 POP POP POP JUMP JUMPDEST PUSH0 DUP1 PUSH0 PUSH1 0x60 DUP5 DUP7 SUB SLT ISZERO PUSH2 0x808 JUMPI PUSH0 DUP1 REVERT JUMPDEST PUSH2 0x811 DUP5 PUSH2 0x7B3 JUMP JUMPDEST SWAP3 POP PUSH2 0x81F PUSH1 0x20 DUP6 ADD PUSH2 0x7B3 JUMP JUMPDEST SWAP2 POP PUSH1 0x40 DUP5 ADD CALLDATALOAD SWAP1 POP SWAP3 POP SWAP3 POP SWAP3 JUMP JUMPDEST PUSH0 PUSH1 0x20 DUP3 DUP5 SUB SLT ISZERO PUSH2 0x83F JUMPI PUSH0 DUP1 REVERT JUMPDEST POP CALLDATALOAD SWAP2 SWAP1 POP JUMP JUMPDEST PUSH0 PUSH1 0x20 DUP3 DUP5 SUB SLT ISZERO PUSH2 0x856 JUMPI PUSH0 DUP1 REVERT JUMPDEST PUSH2 0x85F DUP3 PUSH2 0x7B3 JUMP JUMPDEST SWAP4 SWAP3 POP POP POP JUMP JUMPDEST PUSH0 DUP1 PUSH1 0x40 DUP4 DUP6 SUB SLT ISZERO PUSH2 0x877 JUMPI PUSH0 DUP1 REVERT JUMPDEST PUSH2 0x880 DUP4 PUSH2 0x7B3 JUMP JUMPDEST SWAP2 POP PUSH2 0x88E PUSH1 0x20 DUP5 ADD PUSH2 0x7B3 JUMP JUMPDEST SWAP1 POP SWAP3 POP SWAP3 SWAP1 POP JUMP JUMPDEST PUSH1 0x1 DUP2 DUP2 SHR SWAP1 DUP3 AND DUP1 PUSH2 0x8AB JUMPI PUSH1 0x7F DUP3 AND SWAP2 POP JUMPDEST PUSH1 0x20 DUP3 LT DUP2 SUB PUSH2 0x8C9 JUMPI PUSH4 0x4E487B71 PUSH1 0xE0 SHL PUSH0 MSTORE PUSH1 0x22 PUSH1 0x4 MSTORE PUSH1 0x24 PUSH0 REVERT JUMPDEST POP SWAP2 SWAP1 POP JUMP JUMPDEST DUP1 DUP3 ADD DUP1 DUP3 GT ISZERO PUSH2 0x2DA JUMPI PUSH4 0x4E487B71 PUSH1 0xE0 SHL PUSH0 MSTORE PUSH1 0x11 PUSH1 0x4 MSTORE PUSH1 0x24 PUSH0 REVERT INVALID LOG2 PUSH5 0x6970667358 0x22 SLT KECCAK256 NOT 0xE3 LOG1 PUSH24 0x92AC30FCB9DFDC54912155FDDA51A595AF9CC18955446055 0xDD 0xFC 0xF9 MSTORE PUSH5 0x736F6C6343 STOP ADDMOD EQ STOP CALLER ",
  sourceMap:
    "168:547:6:-:0;;;213:213;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;348:10;326:4;332:6;1962:5:2;:13;326:4:6;1962:5:2;:13;:::i;:::-;-1:-1:-1;1985:7:2;:17;1995:7;1985;:17;:::i;:::-;-1:-1:-1;;;;;;;;1273:26:0;;1269:95;;1322:31;;-1:-1:-1;;;1322:31:0;;1350:1;1322:31;;;4354:51:7;4327:18;;1322:31:0;;;;;;;;1269:95;1373:32;1392:12;1373:18;:32::i;:::-;-1:-1:-1;370:49:6::2;376:10;404:14;3075:2:2::0;404::6::2;:14;:::i;:::-;388:30;::::0;:13;:30:::2;:::i;:::-;370:5;:49::i;:::-;213:213:::0;;;168:547;;2912:187:0;3004:6;;;-1:-1:-1;;;;;3020:17:0;;;-1:-1:-1;;;;;;3020:17:0;;;;;;;3052:40;;3004:6;;;3020:17;3004:6;;3052:40;;2985:16;;3052:40;2975:124;2912:187;:::o;7721:208:2:-;-1:-1:-1;;;;;7791:21:2;;7787:91;;7835:32;;-1:-1:-1;;;7835:32:2;;7864:1;7835:32;;;4354:51:7;4327:18;;7835:32:2;4208:203:7;7787:91:2;7887:35;7903:1;7907:7;7916:5;7887:7;:35::i;:::-;7721:208;;:::o;6271:1107::-;-1:-1:-1;;;;;6360:18:2;;6356:540;;6512:5;6496:12;;:21;;;;;;;:::i;:::-;;;;-1:-1:-1;6356:540:2;;-1:-1:-1;6356:540:2;;-1:-1:-1;;;;;6570:15:2;;6548:19;6570:15;;;;;;;;;;;6603:19;;;6599:115;;;6649:50;;-1:-1:-1;;;6649:50:2;;-1:-1:-1;;;;;6454:32:7;;6649:50:2;;;6436:51:7;6503:18;;;6496:34;;;6546:18;;;6539:34;;;6409:18;;6649:50:2;6234:345:7;6599:115:2;-1:-1:-1;;;;;6834:15:2;;:9;:15;;;;;;;;;;6852:19;;;;6834:37;;6356:540;-1:-1:-1;;;;;6910:16:2;;6906:425;;7073:12;:21;;;;;;;6906:425;;;-1:-1:-1;;;;;7284:13:2;;:9;:13;;;;;;;;;;:22;;;;;;6906:425;7361:2;-1:-1:-1;;;;;7346:25:2;7355:4;-1:-1:-1;;;;;7346:25:2;;7365:5;7346:25;;;;6730::7;;6718:2;6703:18;;6584:177;7346:25:2;;;;;;;;6271:1107;;;:::o;14:127:7:-;75:10;70:3;66:20;63:1;56:31;106:4;103:1;96:15;130:4;127:1;120:15;146:840;200:5;253:3;246:4;238:6;234:17;230:27;220:55;;271:1;268;261:12;220:55;294:13;;-1:-1:-1;;;;;356:10:7;;;353:36;;;369:18;;:::i;:::-;444:2;438:9;412:2;498:13;;-1:-1:-1;;494:22:7;;;518:2;490:31;486:40;474:53;;;542:18;;;562:22;;;539:46;536:72;;;588:18;;:::i;:::-;628:10;624:2;617:22;663:2;655:6;648:18;685:4;675:14;;730:3;725:2;720;712:6;708:15;704:24;701:33;698:53;;;747:1;744;737:12;698:53;769:1;760:10;;779:133;793:2;790:1;787:9;779:133;;;881:14;;;877:23;;871:30;850:14;;;846:23;;839:63;804:10;;;;779:133;;;954:1;932:15;;;928:24;;;921:35;;;;936:6;146:840;-1:-1:-1;;;;146:840:7:o;991:623::-;1099:6;1107;1115;1168:2;1156:9;1147:7;1143:23;1139:32;1136:52;;;1184:1;1181;1174:12;1136:52;1211:16;;-1:-1:-1;;;;;1276:14:7;;;1273:34;;;1303:1;1300;1293:12;1273:34;1326:61;1379:7;1370:6;1359:9;1355:22;1326:61;:::i;:::-;1316:71;;1433:2;1422:9;1418:18;1412:25;1396:41;;1462:2;1452:8;1449:16;1446:36;;;1478:1;1475;1468:12;1446:36;;1501:63;1556:7;1545:8;1534:9;1530:24;1501:63;:::i;:::-;1491:73;;;1604:2;1593:9;1589:18;1583:25;1573:35;;991:623;;;;;:::o;1619:380::-;1698:1;1694:12;;;;1741;;;1762:61;;1816:4;1808:6;1804:17;1794:27;;1762:61;1869:2;1861:6;1858:14;1838:18;1835:38;1832:161;;1915:10;1910:3;1906:20;1903:1;1896:31;1950:4;1947:1;1940:15;1978:4;1975:1;1968:15;1832:161;;1619:380;;;:::o;2130:545::-;2232:2;2227:3;2224:11;2221:448;;;2268:1;2293:5;2289:2;2282:17;2338:4;2334:2;2324:19;2408:2;2396:10;2392:19;2389:1;2385:27;2379:4;2375:38;2444:4;2432:10;2429:20;2426:47;;;-1:-1:-1;2467:4:7;2426:47;2522:2;2517:3;2513:12;2510:1;2506:20;2500:4;2496:31;2486:41;;2577:82;2595:2;2588:5;2585:13;2577:82;;;2640:17;;;2621:1;2610:13;2577:82;;;2581:3;;;2221:448;2130:545;;;:::o;2851:1352::-;2971:10;;-1:-1:-1;;;;;2993:30:7;;2990:56;;;3026:18;;:::i;:::-;3055:97;3145:6;3105:38;3137:4;3131:11;3105:38;:::i;:::-;3099:4;3055:97;:::i;:::-;3207:4;;3271:2;3260:14;;3288:1;3283:663;;;;3990:1;4007:6;4004:89;;;-1:-1:-1;4059:19:7;;;4053:26;4004:89;-1:-1:-1;;2808:1:7;2804:11;;;2800:24;2796:29;2786:40;2832:1;2828:11;;;2783:57;4106:81;;3253:944;;3283:663;2077:1;2070:14;;;2114:4;2101:18;;-1:-1:-1;;3319:20:7;;;3437:236;3451:7;3448:1;3445:14;3437:236;;;3540:19;;;3534:26;3519:42;;3632:27;;;;3600:1;3588:14;;;;3467:19;;3437:236;;;3441:3;3701:6;3692:7;3689:19;3686:201;;;3762:19;;;3756:26;-1:-1:-1;;3845:1:7;3841:14;;;3857:3;3837:24;3833:37;3829:42;3814:58;3799:74;;3686:201;-1:-1:-1;;;;;3933:1:7;3917:14;;;3913:22;3900:36;;-1:-1:-1;2851:1352:7:o;4416:127::-;4477:10;4472:3;4468:20;4465:1;4458:31;4508:4;4505:1;4498:15;4532:4;4529:1;4522:15;4548:422;4637:1;4680:5;4637:1;4694:270;4715:7;4705:8;4702:21;4694:270;;;4774:4;4770:1;4766:6;4762:17;4756:4;4753:27;4750:53;;;4783:18;;:::i;:::-;4833:7;4823:8;4819:22;4816:55;;;4853:16;;;;4816:55;4932:22;;;;4892:15;;;;4694:270;;;4698:3;4548:422;;;;;:::o;4975:806::-;5024:5;5054:8;5044:80;;-1:-1:-1;5095:1:7;5109:5;;5044:80;5143:4;5133:76;;-1:-1:-1;5180:1:7;5194:5;;5133:76;5225:4;5243:1;5238:59;;;;5311:1;5306:130;;;;5218:218;;5238:59;5268:1;5259:10;;5282:5;;;5306:130;5343:3;5333:8;5330:17;5327:43;;;5350:18;;:::i;:::-;-1:-1:-1;;5406:1:7;5392:16;;5421:5;;5218:218;;5520:2;5510:8;5507:16;5501:3;5495:4;5492:13;5488:36;5482:2;5472:8;5469:16;5464:2;5458:4;5455:12;5451:35;5448:77;5445:159;;;-1:-1:-1;5557:19:7;;;5589:5;;5445:159;5636:34;5661:8;5655:4;5636:34;:::i;:::-;5706:6;5702:1;5698:6;5694:19;5685:7;5682:32;5679:58;;;5717:18;;:::i;:::-;5755:20;;-1:-1:-1;4975:806:7;;;;;:::o;5786:140::-;5844:5;5873:47;5914:4;5904:8;5900:19;5894:4;5873:47;:::i;:::-;5864:56;5786:140;-1:-1:-1;;;5786:140:7:o;5931:168::-;6004:9;;;6035;;6052:15;;;6046:22;;6032:37;6022:71;;6073:18;;:::i;6104:125::-;6169:9;;;6190:10;;;6187:36;;;6203:18;;:::i;6584:177::-;168:547:6;;;;;;",
};

// This is the original, non-flattened contract source code for reference
export const ORIGINAL_TOKEN_SOURCE_CODE = `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SimpleToken is ERC20, Ownable {
    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply
    ) ERC20(name, symbol) Ownable(msg.sender) {
        _mint(msg.sender, initialSupply * 10 ** decimals());
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
    }

    function renounceOwnership() public override onlyOwner {
        super.renounceOwnership();
    }
}
`;
