import { describe, it, expect } from "vitest";
import formatOperationData from "./setOperationData";
import { type FieldSchemaType } from "~/app/operations/editOperation";
import { type Erc7730 } from "./types";

const mockERC: Erc7730 = {
  context: {
    $id: null,
    contract: {
      deployments: [
        {
          chainId: 1,
          address: "0x0bb4D3e88243F4A057Db77341e6916B0e449b158",
        },
      ],
      abi: [],
      addressMatcher: null,
      factory: null,
    },
  },
  metadata: {
    owner: null,
    info: null,
    token: null,
    constants: null,
    enums: null,
  },
  display: {
    definitions: null,
    formats: {},
  },
};

const classierFormat = {
  "mintToken(uint256,uint256,address,uint256,bytes)": {
    $id: null,
    intent: null,
    screens: null,
    fields: [
      {
        $id: null,
        label: "Event Id",
        format: "raw",
        params: null,
        path: "#.eventId",
        value: null,
      },
      {
        $id: null,
        label: "Token Id",
        format: "raw",
        params: null,
        path: "#.tokenId",
        value: null,
      },
    ],
    required: null,
    excluded: null,
  },
};

const recursiveFormat = {
  'display.formats["claimBAKC((uint128,uint128)[],(uint128,uint128)[],address)"]':
    {
      $id: null,
      intent: null,
      screens: null,
      fields: [
        {
          path: "#._baycPairs.[]",
          value: null,
          fields: [
            {
              path: "",
              value: null,
              fields: [
                {
                  $id: null,
                  label: "Main Token Id",
                  format: "raw",
                  params: null,
                  path: "mainTokenId",
                  value: null,
                },
                {
                  $id: null,
                  label: "Bakc Token Id",
                  format: "raw",
                  params: null,
                  path: "bakcTokenId",
                  value: null,
                },
              ],
            },
          ],
        },
        {
          path: "#._maycPairs.[]",
          value: null,
          fields: [
            {
              path: "",
              value: null,
              fields: [
                {
                  $id: null,
                  label: "Main Token Id",
                  format: "raw",
                  params: null,
                  path: "mainTokenId",
                  value: null,
                },
                {
                  $id: null,
                  label: "Bakc Token Id",
                  format: "raw",
                  params: null,
                  path: "bakcTokenId",
                  value: null,
                },
              ],
            },
          ],
        },
        {
          $id: null,
          label: "Recipient",
          format: "addressName",
          params: {
            types: ["eoa", "wallet"],
            sources: null,
          },
          path: "#._recipient",
          value: null,
        },
      ],
      required: null,
      excluded: null,
    },
};

describe("setOperationData", () => {
  it("should return the current state and final state", () => {
    const testEct = {
      ...mockERC,
      display: {
        formats: classierFormat,
      },
    } as Erc7730;
    const mockState = {
      generatedErc7730: testEct,
      finalErc7730: testEct,
    };

    const operationName = "mintToken(uint256,uint256,address,uint256,bytes)";
    const formField: FieldSchemaType[] = [
      {
        label: "modify",
        format: "addressName",
        params: {
          types: ["eoa", "wallet"],
          sources: null,
        },
        isIncluded: true,
      },
      {
        label: "modify",
        format: "raw",
        params: {},
        isIncluded: false,
      },
    ];

    const { finalErc7730, generatedErc7730 } = formatOperationData(
      mockState,
      operationName,
      "newIntent",
      formField,
    );

    expect(generatedErc7730?.display?.formats[operationName]?.intent).toEqual(
      "newIntent",
    );

    expect(generatedErc7730?.display?.formats[operationName]?.fields).toEqual([
      {
        $id: null,
        label: "modify",
        format: "addressName",
        params: {
          types: ["eoa", "wallet"],
          sources: null,
        },
        path: "#.eventId",
        value: null,
      },
      {
        $id: null,
        label: "modify",
        format: "raw",
        params: {},
        path: "#.tokenId",
        value: null,
      },
    ]);
    expect(finalErc7730?.display?.formats[operationName]?.fields).toEqual([
      {
        $id: null,
        label: "modify",
        format: "addressName",
        params: {
          types: ["eoa", "wallet"],
          sources: null,
        },
        path: "#.eventId",
        value: null,
      },
    ]);
  });
});
