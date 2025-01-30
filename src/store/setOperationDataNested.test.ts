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

const recursiveFormat = {
  "claimBAKC((uint128,uint128)[],(uint128,uint128)[],address)": {
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

describe("setOperationData recursive", () => {
  describe("recursive fields", () => {
    it("should return the current state and final state", () => {
      const testEct = {
        ...mockERC,
        display: {
          formats: recursiveFormat,
        },
      } as Erc7730;
      const mockState = {
        generatedErc7730: testEct,
        finalErc7730: testEct,
      };

      const operationName =
        "claimBAKC((uint128,uint128)[],(uint128,uint128)[],address)";

      const formField: FieldSchemaType[] = [
        {
          label: null,
          format: "raw",
          params: {},
          isIncluded: true,
          fields: [
            {
              label: null,
              format: "raw",
              params: {},
              isIncluded: true,
              fields: [
                {
                  label: "Main Token 2",
                  format: "raw",
                  params: {},
                  isIncluded: false,
                },
                {
                  label: "Bakc Token 2",
                  format: "raw",
                  params: {},
                  isIncluded: false,
                },
              ],
            },
          ],
        },
        {
          label: "newLabelForRecipient",
          format: "addressName",
          params: {
            types: ["eoa", "wallet"],
            sources: null,
          },
          isIncluded: true,
        },
      ];

      const { generatedErc7730 } = formatOperationData(
        mockState,
        operationName,
        "newIntent",
        formField,
      );

      expect(generatedErc7730?.display?.formats[operationName]?.intent).toEqual(
        "newIntent",
      );

      console.log(
        "generatedErc7730",
        generatedErc7730?.display?.formats[operationName]?.fields,
      );

      expect(generatedErc7730?.display?.formats[operationName]?.fields).toEqual(
        [
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
                $id: null,
                label: "newLabelForRecipient",
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
        ],
      );
    });
  });
});
