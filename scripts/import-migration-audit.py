"""Copy only public, reviewed fields from the local audit into the website."""
import argparse,json,pathlib

parser=argparse.ArgumentParser()
parser.add_argument('source',type=pathlib.Path)
args=parser.parse_args()
records=json.loads(args.source.read_text(encoding='utf-8'))
public=[]
for row in records:
    fields=['id','name','local','server','status','route','route_note','purpose','impact','priority','difficulty','difficulty_reason','fabric_target','removal']
    item={key:row[key] for key in fields}
    item['source']=next((row.get(k) for k in ['route_source','source'] if str(row.get(k,'')).startswith('https://')),None)
    item['files']=[{key:f[key] for key in ['file','version','local','server']} for f in row['files']]
    item['evidence']=row.get('sample_presence',{})
    # Rendering-only overrides include vanilla block/item models, not owned world content.
    if row['id'] in ['betterbeds','enhancedblockentities','fastchest','modefite'] and not row['server']:
        item.update(priority=0,impact='CLIENT',removal='This client-side rendering or item-definition feature stops. It is not installed on this server and does not own the server’s blocks or inventories.')
    public.append(item)
assert len(public)==len({r['id'] for r in public})==429
payload={'checked':'2026-10-30','sourceVersion':'1.20.1 / Fabric','targetVersion':'1.21.1 / NeoForge','clientFiles':405,'serverFiles':338,'sampledChunks':18,'mods':sorted(public,key=lambda r:r['name'].casefold())}
out=pathlib.Path(__file__).resolve().parents[1]/'public/migration/audit.json'
out.write_text(json.dumps(payload,ensure_ascii=False,separators=(',',':')),encoding='utf-8')
print(f'Exported {len(public)} mods; private paths, hashes, log data and player records excluded.')
