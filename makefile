VERSION=0.1.4

build:
	deno run --allow-env --allow-read --allow-write --allow-net --allow-run build.ts $(VERSION)

publish: build
	cd npm && npm publish
