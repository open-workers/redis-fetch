VERSION=0.1.0

build:
	deno run --allow-env --allow-read --allow-write --allow-net --allow-run build.ts $(VERSION)