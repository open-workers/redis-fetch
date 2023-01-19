import { build, emptyDir } from 'https://deno.land/x/dnt@0.33.0/mod.ts';

await emptyDir('./npm');

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
    // package.json properties
    name: 'redis-fetch',
    version: Deno.args[0],
    description: 'Your package.',
    author: 'OpenWorkers Contributors',
    license: 'MIT',
    repository: {
      type: 'git',
      url: 'git+https://github.com/username/repo.git'
    },
    bugs: {
      url: 'https://github.com/username/repo/issues'
    }
  }
});
