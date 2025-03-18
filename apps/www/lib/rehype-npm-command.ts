import { UnistNode, UnistTree } from "types/unist";
import { visit } from "unist-util-visit";

export function rehypeNpmCommand() {
	return (tree: UnistTree) => {
		visit(tree, (node: UnistNode) => {
			if (node.type !== "element" || node?.tagName !== "pre") {
				return;
			}
			// npm install.
			if (node.properties?.["__rawString__"]?.startsWith("npm install")) {
				const npmCommand = node.properties?.["__rawString__"];
				node.properties["__npmCommand__"] = npmCommand;
				node.properties["__yarnCommand__"] = npmCommand.replace(
					"npm install",
					"yarn add",
				);
				node.properties["__pnpmCommand__"] = npmCommand.replace(
					"npm install",
					"pnpm add",
				);
				node.properties["__bunCommand__"] = npmCommand.replace(
					"npm install",
					"bun add",
				);
			}

			// npx create-.
			if (node.properties?.["__rawString__"]?.startsWith("npx create-")) {
				const npmCommand = node.properties?.["__rawString__"];
				node.properties["__npmCommand__"] = npmCommand;
				node.properties["__yarnCommand__"] = npmCommand.replace(
					"npx create-",
					"yarn create ",
				);
				node.properties["__pnpmCommand__"] = npmCommand.replace(
					"npx create-",
					"pnpm create ",
				);
				node.properties["__bunCommand__"] = npmCommand.replace(
					"npx",
					"bunx --bun",
				);
			}

			// npm create.
			if (node.properties?.["__rawString__"]?.startsWith("npm create")) {
				const npmCommand = node.properties?.["__rawString__"];
				node.properties["__npmCommand__"] = npmCommand;
				node.properties["__yarnCommand__"] = npmCommand.replace(
					"npm create",
					"yarn create",
				);
				node.properties["__pnpmCommand__"] = npmCommand.replace(
					"npm create",
					"pnpm create",
				);
				node.properties["__bunCommand__"] = npmCommand.replace(
					"npm create",
					"bun create",
				);
			}

			// npx.
			if (
				node.properties?.["__rawString__"]?.startsWith("npx") &&
				!node.properties?.["__rawString__"]?.startsWith("npx create-")
			) {
				const npmCommand = node.properties?.["__rawString__"];
				const lastWord = npmCommand?.split(" ").pop()?.trim() || "";
				const customRegistry = `${process.env.NEXT_PUBLIC_APP_URL}/r/styles/default/${lastWord}.json`;
				console.log("custom:", process.env);
				node.properties["__npmCommand__"] = npmCommand.replace(
					lastWord,
					customRegistry,
				);
				node.properties["__yarnCommand__"] = npmCommand.replace(
					lastWord,
					customRegistry,
				);
				node.properties["__pnpmCommand__"] = npmCommand
					.replace("npx", "pnpm dlx")
					.replace(lastWord, customRegistry);
				node.properties["__bunCommand__"] = npmCommand
					.replace("npx", "bunx --bun")
					.replace(lastWord, customRegistry);
			}

			// npm run.
			if (node.properties?.["__rawString__"]?.startsWith("npm run")) {
				const npmCommand = node.properties?.["__rawString__"];
				node.properties["__npmCommand__"] = npmCommand;
				node.properties["__yarnCommand__"] = npmCommand.replace(
					"npm run",
					"yarn",
				);
				node.properties["__pnpmCommand__"] = npmCommand.replace(
					"npm run",
					"pnpm",
				);
				node.properties["__bunCommand__"] = npmCommand.replace(
					"npm run",
					"bun",
				);
			}
		});
	};
}
