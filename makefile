VERSION=0.1.1

build:
	deno run --allow-env --allow-read --allow-write --allow-net --allow-run build.ts $(VERSION)

publish: build
	cd npm && npm publish
