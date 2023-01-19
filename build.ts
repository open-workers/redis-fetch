import { build, emptyDir } from 'https://deno.land/x/dnt@0.33.0/mod.ts';

await emptyDir('./npm');

await Deno.copyFile('./README.md', './npm/README.md');

await build({
  entryPoints: ['./main.ts'],
  declaration: true,
  outDir: './npm',
  shims: {
    // see JS docs for overview and more options
    deno: true
  },
  compilerOptions: {
    // see TS docs for overview and more options
    lib: ['esnext', 'webworker']
  },
  package: {
    name: '@openworkers/redis-fetch',
    version: Deno.args[0],
    description: 'A simple package that interfaces Redis with HTTP.',
    author: 'OpenWorkers Contributors',
    private: false,
    license: 'MIT',
    repository: {
      type: 'git',
      url: 'git+https://github.com/open-workers/redis-fetch.git'
    },
    bugs: {
      url: 'https://github.com/open-workers/redis-fetch/issues'
    }
  }
});
