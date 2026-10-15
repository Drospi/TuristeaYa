const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'turisteaya-tests-'));
for (const name of ['route-repository', 'data/route-planner', 'data/real-places']) {
  const source = fs.readFileSync(path.join(root, 'src/features/turista', name + '.ts'), 'utf8');
  const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const target = path.join(temp, name + '.js'); fs.mkdirSync(path.dirname(target), { recursive: true }); fs.writeFileSync(target, output);
}
const { RouteRepository, decodeRoutes } = require(path.join(temp, 'route-repository.js'));
const { allCategories, catalogRoutes, matchingRoutes, defaultCriteria } = require(path.join(temp, 'data/route-planner.js'));
const { realPlaces } = require(path.join(temp, 'data/real-places.js'));
(async () => {
  for (let mask = 1; mask <= 7; mask++) {
    const categories = allCategories.filter((_, index) => mask & (1 << index));
    const matches = matchingRoutes({ ...defaultCriteria, categories, budget: 9999, minutes: 9999 });
    assert.equal(matches.length, 3, `Combinación ${categories}: tres rutas`);
    for (const route of matches) {
      assert.deepEqual([...route.categories].sort(), [...categories].sort());
      assert.equal(new Set(route.placeIds).size, route.placeIds.length);
      assert.ok(route.placeIds.every((id) => realPlaces.some((place) => place.id === id && !place.isDemo && place.sourceUrl)));
    }
  }
  assert.equal(matchingRoutes({ ...defaultCriteria, categories: ['gastronomia'], budget: 0 }).length, 0);
  assert.equal(matchingRoutes({ ...defaultCriteria, minutes: 1 }).length, 0);
  assert.equal(matchingRoutes({ ...defaultCriteria, maxDistance: 0.001 }).length, 0);
  assert.equal(matchingRoutes({ ...defaultCriteria, categories: [] }).length, 0);
  console.log('PASS: 21 rutas, siete combinaciones, lugares reales y límites de búsqueda.');

  const file = path.join(temp, 'saved.json'); let fail = false;
  const storage = {
    getItem: async () => fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null,
    setItem: async (_, value) => { if (fail) throw new Error('Sin espacio'); fs.writeFileSync(file, value); },
  };
  const first = new RouteRepository(storage); await first.load();
  const catalog = catalogRoutes(); const savedId = await first.save(catalog[0]);
  assert.equal(await first.save(catalog[0]), savedId); assert.equal(first.snapshot().routes.length, 1);
  await Promise.all([first.addPlace(savedId, 'calle-jaen'), first.addPlace(savedId, 'killi-killi')]);
  assert.equal(first.snapshot().routes[0].placeIds.length, 4);
  await first.addPlace(savedId, 'calle-jaen'); assert.equal(first.snapshot().routes[0].placeIds.length, 4);
  assert.equal(first.snapshot().routes[0].categories.length, 3);
  const second = new RouteRepository(storage); await second.load();
  assert.deepEqual(second.snapshot().routes, first.snapshot().routes);
  console.log('PASS: guardar, recargar desde disco, añadir sin duplicar ni perder cambios simultáneos.');

  const reversed = [...second.snapshot().routes[0].placeIds].reverse();
  await second.updateStops(savedId, reversed);
  await second.setVisited(savedId, true);
  const third = new RouteRepository(storage); await third.load();
  assert.deepEqual(third.snapshot().routes[0].placeIds, reversed); assert.equal(third.snapshot().routes[0].visited, true);
  await assert.rejects(third.updateStops(savedId, []));
  const before = JSON.stringify(third.snapshot().routes);
  fail = true; await assert.rejects(third.addPlace(savedId, 'parque-urbano'));
  assert.equal(JSON.stringify(third.snapshot().routes), before); fail = false;
  await third.create('Nueva ruta', 'mercado-rodriguez', defaultCriteria.origin, defaultCriteria.departure);
  assert.equal(third.snapshot().routes.length, 2);
  await third.remove(savedId);
  const fourth = new RouteRepository(storage); await fourth.load(); assert.equal(fourth.snapshot().routes.length, 1);
  assert.throws(() => decodeRoutes('{bad json'));
  fs.writeFileSync(file, '{corrupt'); const corrupt = new RouteRepository(storage); await corrupt.load();
  assert.equal(corrupt.snapshot().ready, false); await assert.rejects(corrupt.save(catalog[0]));
  assert.equal(fs.readFileSync(file, 'utf8'), '{corrupt');
  console.log('PASS: reordenar, visitar, crear, eliminar, errores de escritura y protección de datos corruptos.');
})().then(() => fs.rmSync(temp, { recursive: true, force: true })).catch((error) => { console.error(error); process.exitCode = 1; });
