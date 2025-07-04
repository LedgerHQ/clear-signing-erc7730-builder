import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { Octokit } from "@octokit/rest";
import { env } from "~/env.js";

const TARGET_REPO_OWNER = "LedgerHQ";
const TARGET_REPO_NAME = "clear-signing-erc7730-registry";

export async function POST(request: NextRequest) {
  try {
    const token = await getToken({
      req: request,
      secret: env.NEXTAUTH_SECRET,
    });

    if (!token?.accessToken) {
      return NextResponse.json(
        { error: "Not authenticated or missing access token" },
        { status: 401 },
      );
    }

    const { erc7730Data, contractAddress, protocolName, contractName } =
      (await request.json()) as {
        erc7730Data: object;
        contractAddress: string;
        protocolName: string;
        contractName: string;
      };

    if (!erc7730Data || !contractAddress || !protocolName || !contractName) {
      return NextResponse.json(
        {
          error:
            "Missing required data: erc7730Data, contractAddress, protocolName, or contractName",
        },
        { status: 400 },
      );
    }

    const githubNameRegex = /^[a-zA-Z0-9_-]+$/;
    if (
      !githubNameRegex.test(protocolName) ||
      !githubNameRegex.test(contractName)
    ) {
      return NextResponse.json(
        {
          error:
            "Protocol and contract names must contain only letters, numbers, hyphens, and underscores",
        },
        { status: 400 },
      );
    }

    const octokit = new Octokit({
      auth: token.accessToken,
    });

    const { data: user } = await octokit.rest.users.getAuthenticated();

    const forkOwner = user.login;
    try {
      await octokit.rest.repos.createFork({
        owner: TARGET_REPO_OWNER,
        repo: TARGET_REPO_NAME,
      });
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } catch (error: any) {
      if (!error.message?.includes("already exists")) {
        throw error;
      }
    }

    const branchName = `add-${protocolName}-${contractName}-clear-signing`;

    const { data: defaultBranch } = await octokit.rest.repos.getBranch({
      owner: forkOwner,
      repo: TARGET_REPO_NAME,
      branch: "main",
    });

    await octokit.rest.git.createRef({
      owner: forkOwner,
      repo: TARGET_REPO_NAME,
      ref: `refs/heads/${branchName}`,
      sha: defaultBranch.commit.sha,
    });

    const fileContent = JSON.stringify(erc7730Data, null, 2);
    const filePath = `registry/${protocolName}/${contractName}.json`;

    await octokit.rest.repos.createOrUpdateFileContents({
      owner: forkOwner,
      repo: TARGET_REPO_NAME,
      path: filePath,
      message: `Add ERC-7730 descriptor for ${protocolName}/${contractName} (${contractAddress})`,
      content: Buffer.from(fileContent).toString("base64"),
      branch: branchName,
    });

    const { data: pullRequest } = await octokit.rest.pulls.create({
      owner: TARGET_REPO_OWNER,
      repo: TARGET_REPO_NAME,
      title: `Add ERC-7730 descriptor for ${protocolName}/${contractName}`,
      head: `${forkOwner}:${branchName}`,
      base: "main",
      body: `This PR adds an ERC-7730 descriptor for the ${protocolName} protocol.

## Summary
- **Protocol**: ${protocolName}
- **Contract**: ${contractName}
- **Contract Address**: \`${contractAddress}\`
- **File Path**: \`registry/${protocolName}/${contractName}.json\`
- **Generated via**: [Clear Signing ERC7730 Builder](https://clear-signing-erc7730-builder.vercel.app/)

Please review the descriptor for accuracy and completeness.`,
    });

    return NextResponse.json({
      success: true,
      pullRequestUrl: pullRequest.html_url,
      pullRequestNumber: pullRequest.number,
    });
  } catch (error: any) {
    console.error("Error creating PR:", error);
    return NextResponse.json(
      {
        error: "Failed to create pull request",
        details: error.message,
      },
      { status: 500 },
    );
  }
}
