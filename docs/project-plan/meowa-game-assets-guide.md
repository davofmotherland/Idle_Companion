# Meowa API �����ĵ�

���ýű���

- `skills/meowart_api.py`

����ĵ�ֻ������õĵ��÷�ʽ����Ϊ������ڡ�
��Ҫȷ������ CLI ����ʱ�����Բ鿴�ű��� `--help`��

��Ҫ endpoint ����

- ������ `POST /generate` �� `POST /api/generate`��
- �����ʲ����ɹ̶�ʹ�� `POST /api/pixel-gen`������ `GET /api/pixel-gen/jobs?id=<api_job_id>` ��ѯ��
- �����ʲ����ɹ̶�ʹ�� `POST /api/hd-gen`������ `GET /api/hd-gen/jobs?id=<api_job_id>` ��ѯ��
- ��Ϸ UI ͼ�����ɹ̶�ʹ�� `POST /api/workflows/general_ui_gen/run`������ `GET /api/jobs?id=<job_id>` ��ѯ��
- ͨ�� Gemini ����ʹ�� `POST /api/gemini/...` ���װ���� `gemini-generate-content`��
- ������÷��յ� 404 ��·���� `/generate`�������� endpoint����Ҫ��������Ϊ API key ��Ч��

��������������

- `credits-balance`����ѯ��ǰ�˺�ʣ�� credit���ʺ�����������ǰ��ȷ�϶���Ƿ���㡣
- `pixel-gen-run`�������ʲ�Ĭ����ڡ�����ģ����������ͼƬ���ʺϽ�ɫ�������������ߡ�icon��UI Сͼ�ꡢͨ�ô�ߴ����ؽ�ɫ�Ͷ���������ʲ���������Զ��ύ����ѯ����������ĳЩģ��֧���������� N �� Sprite�����Ƿ��ò��䡣
- `hd-gen-run`������������ʲ���ڡ����� HD ģ������͸�� PNG ��ɫ��ͼ�ꡢ��Ʒ���ȣ�������Զ��ύ����ѯ����������
- `character-multi-view-run`����һ�����н�ɫ�ο�ͼ���ɽ�ɫ����ͼ����� 8 ��͸������ͼ��һ�� 3x3 Ԥ��ͼ��֧�� `pixel` �� `hd` ģʽ��
- `ui-gen-run`����Ϸ UI ͼ��ר����ڡ��ʺ� HUD���˵�����ť����塢���������������ڡ�UI icon ��ϵȣ�֧�ֲο�ͼ��͸����������� bbox ��֣�Ҳ֧�� `ui_extract` ������ UI ͼ���ȡ�����
- `gemini-generate-content`��ͨ��������ڣ�nano banana�����ʺϷ����ظ���ͼ������/�廭�ʲ������������������塣��Ҫ������Ϊ���� sprite�����ؽ�ɫ�����ص��ߡ����� icon ����Ϸ UI ͼ����Ĭ����ڣ������ʲ�ֻ��û�к���ģ����û���ȷ����ģ��ʱ�� fallback �����
- `self-loop-run`����������ͼƬ���� self-loop �޷�ѭ��ͼ��Ŀǰ֧�ֺ���������޷�ƴ�ӣ��ʺ����ں����ᱳ�������򳡾��Ϳ��ظ�ƽ�̵������
- `texture-gen-run`�����ɵ����������� texture���ʺ�ˮ�桢ʯ�顢ǽ�桢ľ�塢�ҽ��ȿ�ƽ�̵ر����ʣ�Ĭ��׷���ķ����������
- `tileset-gen-run`������ dual-grid 15 ���ι��� tileset���ʺϲݵ�/ˮ�桢ʯ��/�ҽ���ǰ���ͱ��� terrain ���ɡ�
- `map-reference-search` / `map-reference-download`������������ Meowa ���õ�ͼ preset ͼƬ����ͼ����������Ȳ����������к���ͼƬ��ֱ���� preset����Ҫ�����ɡ�
- `isometric-gen-run`���������صȽǵ�ͼ�飬��� workflow Ϊ `pixel_isometric_gen`��
- `hex-isometric-gen-run`�������������ǵȽǵ�ͼ�飬��� workflow Ϊ `pixel_hex_isometric_gen`��
- `hd-isometric-gen-run`�����ɸ���Ƚǵ�ͼ�飬��� workflow Ϊ `hd_isometric_gen`��
- `hd-hex-isometric-gen-run`�����ɸ������ǵȽǵ�ͼ�飬��� workflow Ϊ `hd_hex_isometric_gen`��
- `remove-background-run`��������ͼƬ��ȥ��������
  - ����ͼƬʹ�� `pixel` ģʽ��ֻ֧��ȥ��ɫ������֧������ߴ����룬�����ǰ���� pixelate���Ҳ���Ҫ��ǰ���ŵ� nano banana�ߴ硣
  - ��ͨͼƬʹ�� `hd`��֧�����ⱳ��ɫ
- `pixelate-run`���ѽϴ��ͼƬ���������ɸ��ɾ������ط�������ʺ��� AI �����ɴ�ͼ�󣬽����Ϊ�������ص� Sprite��
- `animate-run`�����ڵ��Ž�ɫͼ���ɶ����������ʺ�����ɫ�������ܲ�����Ծ�����������ѭ��������
- `sound-run` / `sfx-run`�����ɶ���Ч���ʺ� UI �����������ʰȡ����ը�����ܡ����������֧�ֵ�������Ч����ͬ��Ч��汾��
- `music-run`�����ɽṹ��������������ѡ��������������Ƶ���ʺ���Ϸ BGM�����������������ַ�����ԡ�

## 0. ����ѡ��

- ��ȷҪ����ͼ��pixel art��sprite����ɫ��������ߡ���Ʒ��icon��UI Сͼ��ʱ����ִ�� `pixel-gen-template-info`�����ú���ģ��ִ�� `pixel-gen-run`��
- ��ȷҪͨ�����ؽ�ɫ����ߴ����ؽ�ɫ���� 1:1 �������ؽ�ɫ/�������û�������ض�����ģ��������ʲ�ʱ������ѡ�� `workflow_id` Ϊ `pixel_gen_general` ��ģ�壬���� `large_3_4`��`large_9_16`��`large_16_9`��`xlarge_1_2`����Ȼʹ�� `pixel-gen-run`����Ҫ���� `gemini-generate-content`��
- ��ȷҪ��������ؽ�ɫ��͸�� PNG������ icon ����Ʒ��ʱ����ִ�� `hd-gen-template-info`������ `hd-gen-run`��
- ��ȷҪ����ɫ����ͼ / 8-direction character / �෽���ɫͼ����������һ�Ž�ɫ�ο�ͼʱ��ִ�� `character-multi-view-run`����Ҫ����ͨ direction ģ���������ɡ�
- ��ȷҪ��Ϸ UI ͼ����HUD���˵�����ť�����ڡ���������������塢UI �����֣�������� UI ͼ��ȡ���ʱ��ִ�� `ui-gen-run`����Ҫ�� `gemini-generate-content` ��Ϊ UI ͼ��Ĭ����ڡ�
- ��ȷҪ��ƽ�� texture / material tile / �ر�����ʱ��ִ�� `texture-gen-run`��
- ��ȷҪ terrain tileset / dual-grid ���ι���ͼʱ��ִ�� `tileset-gen-run`��
- ��ȷҪ��ͼ�顢isometric tile��hex tile��HD isometric map����ͼ preset ʱ����ִ�� `map-reference-search`�����к��ʽ��ʱִ�� `map-reference-download` �� `map-reference-search --download`��ֱ�ӽ��� preset��ֻ��û�к��� preset ʱ��ִ�ж�Ӧ�� `*-isometric-gen-run` ���ɡ�
- ��ȷҪ SFX����Ч��UI click��������ʰȡ����ը��������ʱ��ִ�� `sound-run` �� `sfx-run`��
- ��Ҫ��Ϊ����д�ˡ����������������������ֱ��ʹ�� `gemini-generate-content`���������Ҫ���������ʲ���`pixel-gen-run` ���ȡ�
- ֻ�з����ظ���ͼ������廭�������󱳾�����壬����ȷû�к��� pixel template ʱ����ʹ�� `gemini-generate-content`��
- �����ʲ� fallback �� `gemini-generate-content` ����ֱ�ӽ����������� `pixelate-run`����Ҫ͸��ͼʱ���� `remove-background-run --method pixel`�������ߴ��͸��ͨ����

## 1. ��Ȩ

��ʹ�� Meowa API ǰ���ȵ�¼ [https://meowa.ai/#/api-keys](https://meowa.ai/#/api-keys)��Ȼ�������� `Create API Key` ��ť������һ�� token��

Ĭ��ʹ����ʵ�û� API key��

```http
Authorization: Bearer ma_live_xxxxxxxxxxxxxxxxxxxx
```

����������ֻ�� `ma_live_...` �������Ҫ�� `authenticate:` �����ǩһ���ƽ�ȥ��

��Ŀ���Ի����Բ��𻷾�Ҳ֧�ֿ����߼�Ȩ��

```http
X-Dev-Key: xxxxxxxxxxxxxxxxxxxx
```

�Ƽ������û���������

```bash
export MEOWART_API_KEY="ma_live_xxxxxxxxxxxxxxxxxxxx"
```

`skills/meowart_api.py` ��δ��ʽ���� `--api-key` ʱ�����Զ���ȡ�������������
������� `--dev-key`�������� `MEOWART_DEV_KEY` / `DEV_API_KEY`���ű������ `X-Dev-Key` ���ú�ˡ���ȡ˳�����ȼ��ǣ�

1. `--dev-key`
2. `MEOWART_DEV_KEY` �� `DEV_API_KEY`
3. `.env` ��� `MEOWART_DEV_KEY` �� `DEV_API_KEY`
4. `--api-key`
5. `MEOWART_API_KEY`
6. `.env` ��� `MEOWART_API_KEY`

Ҳ����д�뵱ǰĿ¼��`skills/` Ŀ¼����Ŀ��Ŀ¼�� `.env`��

```bash
MEOWART_API_KEY="ma_live_xxxxxxxxxxxxxxxxxxxx"
MEOWART_DEV_KEY="xxxxxxxxxxxxxxxxxxxx"
```

�Ƽ�����ʹ�û��������� `.env`��������Ҫ��ÿ�ε��� API ʱ����ʽ���� `--api-key`����Ϊ����������ȫ�����׳����� shell ��ʷ����־���ͼ�

�������ʱ�Ҳ��� `MEOWART_API_KEY`��Ӧ�������û����� key����ҪʱҲ����ֱ�Ӱ��û��� API key ҳ�棺

```bash
open "https://meowa.ai/#/api-keys"
```

�����û���������ǰ��������鿴�Լ��� API key��

## 2. ��װ

```bash
pip install requests
python3 skills/meowart_api.py --help
```

## 2.1 Bootstrap �Զ�����

`meowart_api.py` �Դ� bootstrap wrapper������ִ������ʱ�������ȼ��Զ��
`meowart_api.bootstrap.json`��������ָ��߰汾�� CLI runner���������µ�
`meowart_api.py` ���������棬У�� SHA-256 ����ִ�л��� runner����������ʧ��
�����жϵ�ǰ���񣬻��Զ����˵� skill ���ýű���

�������

```bash
python3 skills/meowart_api.py bootstrap-status
python3 skills/meowart_api.py bootstrap-status --check
python3 skills/meowart_api.py --no-bootstrap credits-balance
python3 skills/meowart_api.py --bootstrap-force credits-balance
```

���û���������

- `MEOWART_BOOTSTRAP=0`���رձ���/��ǰ������ bootstrap ��顣
- `MEOWART_BOOTSTRAP_MANIFEST_URL=...`�������Զ��� manifest ��ַ��
- `MEOWART_BOOTSTRAP_CACHE_DIR=...`�������Զ��建��Ŀ¼��
- `MEOWART_BOOTSTRAP_VERBOSE=1`����ӡ bootstrap �����Ϣ��
- `MEOWART_BOOTSTRAP_TIMEOUT=2`������ manifest/runner ���س�ʱʱ�䣬��λ�롣

������Ƹ��µ��� CLI runner��`SKILL.md` �Ĵ���������·��˵����Ȼ�� Codex
���ʱ���ص����ݣ������Щ˵�������仯������Ҫִ�� `skills update` �����°�װ
skill�������� Codex��

## 2.2 ��̬ Skill ָ��

`SKILL.md` ���ȶ� loader��������Ƶ���仯������ѡ����ԡ�API ˵����ģ�彨��
ͨ����ָ̬�ϻ�ȡ��

```bash
python3 skills/meowart_api.py skill-doc --task "���� 64x64 ���ص���"
python3 skills/meowart_api.py skill-doc --topic pixel-gen
python3 skills/meowart_api.py skill-doc-status --check
```

`skill-doc` Ĭ������ Meowa ��˵Ĺ���ֻ���ĵ��ӿڣ������浽
`~/.cache/meowa-skills/game-assets/docs/`��������粻���á��ӿ��쳣��У��ʧ�ܣ�
���Զ����˵���ǰ bundled `meowart_api.md`��

## 3. Credits

```bash
python3 skills/meowart_api.py credits-balance
```

## 4. General Image Generation

For non-pixel concepts, high-resolution illustration, and full-scene background concepts, use `generateContent`.
For game UI sheets, HUDs, menus, and reusable UI components, use `ui-gen-run` instead.

```bash
python3 skills/meowart_api.py \
  gemini-generate-content \
  --text "Write a one-line description of a cream sofa"
```

Reference images can be passed as inline Gemini image parts. `--image-file` can be repeated; `--reference-image` and `--reference-file` are aliases:

```bash
python3 skills/meowart_api.py \
  gemini-generate-content \
  --text "Generate a matching 16:9 background concept using this character's palette." \
  --image-file ./reference_character.png \
  --generation-config '{"responseModalities":["TEXT","IMAGE"],"imageConfig":{"aspectRatio":"16:9","imageSize":"2K"}}'
```

If you need to customize the path or request body, check the `gemini-*` subcommands in `skills/meowart_api.py`.

## 4.1 ��Ϸ UI ͼ������

���û���Ҫ HUD���˵�����ť�����ڡ���������������塢UI icon ��ϡ�������Ϸ UI sheet������Ҫ������ UI �ο�ͼ��ɿɸ������ʱ��ʹ�� `ui-gen-run`��
�ײ� endpoint �� `POST /api/workflows/general_ui_gen/run`������ `/api/gemini/...`��

����һ���� UI��

```bash
python3 skills/meowart_api.py \
  ui-gen-run \
  --prompt "cozy fantasy RPG HUD with HP bar, skill slots, inventory panel, quest panel, and rounded wooden buttons" \
  --template hd_retro_rpg \
  --output-dir ./outputs/ui_gen
```

�����ο�ͼ���ɣ�

```bash
python3 skills/meowart_api.py \
  ui-gen-run \
  --prompt "matching sci-fi mobile game UI kit with top status bar, primary buttons, modal frame, and icon slots" \
  --reference-image ./reference_ui_style.png \
  --output-dir ./outputs/ui_gen
```

������ UI ͼ�г�ȡ�����

```bash
python3 skills/meowart_api.py \
  ui-gen-run \
  --prompt "extract every button, panel, icon slot, bar, and frame as separate transparent UI components" \
  --generation-mode ui_extract \
  --reference-image ./source_ui_sheet.png \
  --output-dir ./outputs/ui_extract
```

���ò�����

- `--prompt`��UI �������������񡢰�����Щ�������Ϸ���͡���ɫ/��������
- `--template`��Ĭ�� `hd_retro_rpg`��������ģ���б���£�����ʹ�ú�˷��ص�ģ�� id��
- `--reference-image` / `--reference-file`�����ظ�������Ժ������Ϊ׼�����ڷ��ο��� `ui_extract` ��Դͼ��
- `--generation-mode generate|ui_extract`��Ĭ�� `generate`��`ui_extract` �����ṩ�ο�ͼ��
- `--remove-background` / `--no-remove-background`��Ĭ���Ƴ����������ڵõ�͸�� UI sheet��
- `--split-components` / `--no-split-components`��Ĭ�ϲ��͸����� bbox Ԫ���ݡ�����ù��ܿ�����ǰ�˻���Ϸ���߸����װ� sheet �еİ�ť�����ڡ�icon slot �����ó�����
- `--split-alpha-threshold`��`--split-connectivity`��`--split-min-component-size`��`--split-bbox-padding`�����������ֵ�͸����ֵ����ͨ�ԡ���С�ߴ��͸���߾ࡣͨ������Ĭ�ϼ��ɡ�

���гɹ��󣬽ű��ᱣ�� `submit_response.json`��`job_response.json` �Ϳ����ص�����ͼƬ�� `--output-dir` �µ�������Ŀ¼��

## 5. ���� Sprite / ��ɫ / ���� / Icon ����

`pixel-gen` �������ʲ���Ĭ����ڡ���õ������� `pixel-gen-run`�������Զ�����ύ����ѯ�ͽ�����ء�
�ײ� endpoint �� `POST /api/pixel-gen`������ `/generate`��

```bash
python3 skills/meowart_api.py \
  pixel-gen-run \
  --template-name "pixel_character_large" \
  --requirement "A fox rogue with twin daggers" \
  --template-config '{"direction":"left"}'
```

���ò�����

- `--template-name`
- `--requirement`
- `--template-config '{}'`
- `--dry-run`
- `--output-dir ./outputs/pixel_gen`
- `--reference-file ./reference.png`
- `--reference-files ./ref2.png`�����ظ����ʺ� `pixel_gen_general` ������Ҫ�����û��ο�ͼ�ĳ���

`--dry-run` ֻ��ӡ�ƻ��ύ�� request ��Ԥ�����Ŀ¼�����ύ���񡢲����Ķ�ȣ�Ҳ����Ҫ API key�����ʺ�����ʽ����ǰȷ��ģ�塢�ߴ硢���·���Ƿ����Ԥ�ڡ�

�����Ҫ�÷���˸����û��ο�ͼ��������򱣳�ɫ��/�������򣬿��Դ� `--reference-file`����Ҫ���Ųο�ͼʱ������׷�� `--reference-files`����Щ������ֱ���Ϊ `/api/pixel-gen` �� `reference_file` �� `reference_files` multipart �ֶ��ϴ���

���ڽű�Ҳ���ݰ�ͨ�ò���д����������棬���� `--api-base`��`--api-key`��`--timeout`��`--max-wait`��`--poll-interval`��`--output-dir`��`--work-dir`��`--no-download`��`--insecure`����������д�������ԣ�

```bash
python3 skills/meowart_api.py --timeout 120 --output-dir ./outputs pixel-gen-run ...
python3 skills/meowart_api.py pixel-gen-run --timeout 120 --output-dir ./outputs ...
```

`*-run` �������ύ�ɹ���Ҳ�����̴�ӡ��

- `planned_output_dir=...`��Ԥ�Ʊ���Ŀ¼
- `submitted api_job_id=...`����������� id

### requirement ��д������

���������׷����һ���ǣ�`--requirement` �����ڡ����շ���ģ�͵����� prompt����

### ģ��ѡ����

- ��Ʒ��Icon��С����Ƽ�����ʹ�� `food`��`object` ģ�壬����ͨ���������� `8` �� `64x64` ���ض���
- ������ǡ������ɫ��С�ߴ�������ɫ����ʹ�� `pixel_char` ģ�壬����ͨ���������� `2` �� `128x128` ���󣻴�ߴ� 1:1 ��ɫ���ȿ� `large_portrait`��ͨ�����ؽ�ɫ����ߴ�� 1:1 ��ɫ��û�������ض���ɫģ��ʱ������ѡ�� `pixel_gen_general` ģ�塣
- `pixel_gen_general` ģ����ͨ������������·��`16_9`��`4_3`��`3_4`��`9_16` �ʺ��еȳߴ���ͼ�����`large_16_9`��`large_4_3`��`large_3_4`��`large_9_16` �ʺϴ�ߴ���ͼ�����`xlarge_1_2`��`xlarge_2_1`��`xlarge_2_3`��`xlarge_3_2` �ʺϵ��ų�����������
- ѡ�� `pixel_gen_general` ʱ��ģ������ı������������ʲ����������ɫ���� `large_3_4`��`large_9_16` �� `xlarge_1_2`������ɫ/�ؾ�/����������� `large_4_3`��`large_16_9` �� `xlarge_2_1`��
- ����ģ�����ơ�����ߴ�������� `pixel-gen-template-info` ����Ϊ׼�����ģ���б�仯���������Žӿڷ��ء�
- ��������ʱ�������� `--requirement` ��ֱ���������������ۣ�Ҳ����һ�仰�������������÷���˰�ģ������������塣����һ��������ģ��֧�ֵ������������Ϊ�۸������ͨ��û�����𣬶�����һЩ��������ѡ��

- ģ����ȸ����Լ���Ĭ�����þ���һ�����ɼ����������� `cat_2` Ĭ���� `8` ����
- ����˻���ģ��� `target_count`������� `requirement` ��������װ������������ prompt��������� prompt ����һ������ɫ�򾫼�
- ���Զ��� `cat`��`cat_2` ������ģ�壬`--requirement` ���ʺ�д����һ��Ҫ����ʲô����������д�ɡ�����һֻ������ɫ��������������ɫ���������ֵ�ͼʽ prompt��

�������˵��

- ���ģ��Ĭ�Ͼ����������� `8` �� sprite����ô `--requirement "è��"` ���ǡ�ֻ���� 1 ֻ�������ǻᱻ��������ɡ����� 8 ��è�䡱��
- ��������� 8 �� sprite �������ֶȣ�Ӧ���� `requirement` ��ֱ������һ�����壬���磺`��������è����ţè�����ޡ�Ӣ�̡����̡��껨������è��ÿһֻ�����Ų�ͬ��ñ�ӡ�`
- ��Ҫ�� `requirement` ���ظ�дģ���Ѿ�������Լ��������ܶ� `pixel-gen` ģ�屾���Ĭ���ǰ׵�/͸���ף������������д����ɫ������ͨ��������ģ�ֻ�����ݵ�������һ�е���������ģ���ڲ������Զ������
- ��Ҫ�ѡ�����һ����ɫ����˵����е���׵�����ģ���ϣ�����ģ�������ģ��� `requirement` д��Ӧ�ò�ͬ��

�Ƽ�ʾ����

ͨ�ô�ߴ����ؽ�ɫ��

```bash
python3 skills/meowart_api.py \
  pixel-gen-run \
  --template-name "large_3_4" \
  --requirement "two full-body fantasy pixel characters: a silver-armored knight and a red-robed fire mage" \
  --output-dir ./outputs/pixel_general_characters
```

ͨ�ú�����ؽ�ɫ�������

```bash
python3 skills/meowart_api.py \
  pixel-gen-run \
  --template-name "large_16_9" \
  --requirement "two side-view pixel airships with brass hulls and blue crystal engines" \
  --output-dir ./outputs/pixel_general_airships
```

�����Ųο�ͼ�� `pixel_gen_general`��

```bash
python3 skills/meowart_api.py \
  pixel-gen-run \
  --template-name "xlarge_1_2" \
  --requirement "one tall full-body pixel heroine, preserve the outfit silhouette and color palette from the references" \
  --reference-file ./ref_pose.png \
  --reference-files ./ref_palette.png \
  --output-dir ./outputs/pixel_xlarge_heroine
```

��ͨ���� sprite��

```bash
python3 skills/meowart_api.py \
  pixel-gen-run \
  --template-name "cat_2" \
  --requirement "��������è����ţè�����ޡ�Ӣ�̡����̡��껨������è"
```

�����ֻ���������һ��ģ���Ƿ�����ͨ���������Ը��̣�

```bash
python3 skills/meowart_api.py \
  pixel-gen-run \
  --template-name "cat_2" \
  --requirement "è��"
```

��ʱ������Իᰴ�ո�ģ��Ĭ�ϵ� `target_count` ȥ����һ���������������ֻ���� 1 �š�

�����ֻ�����ȿ�����Щģ�壬������ִ�У�

```bash
python3 skills/meowart_api.py pixel-gen-template-info
```

���ģ����Ϣ��д�� `supports_direction: true`����ô���ģ��֧�����ó���
���÷�ʽ���ǵ����� `--direction`�����Ƿ��� `--template-config` ����磺

```bash
python3 skills/meowart_api.py \
  pixel-gen-run \
  --template-name "pixel_character_large" \
  --requirement "A fox rogue with twin daggers" \
  --template-config '{"direction":"left"}'
```

�������� `pixel-gen-template-info` �鿴ģ�巵�ص� `directions` �� `default_direction`���پ�����ʲôֵ��

�����Ҫ�鿴���������б���������У�

```bash
python3 skills/meowart_api.py --help
```

## 6. HD �ʲ�����

HD Gen �Ƿ����ظ����ʲ���ڣ��ʺ�͸�� PNG ��ɫ������ icon����Ʒ���ȡ�

�Ȳ鿴����ģ�壺

```bash
python3 skills/meowart_api.py hd-gen-template-info
```

�ύ���ȴ��������ɣ�

```bash
python3 skills/meowart_api.py \
  hd-gen-run \
  --template-name "hd_char_1" \
  --requirement "A cheerful fantasy alchemist girl with green cloak" \
  --template-config '{"direction":"front"}' \
  --output-dir ./outputs/hd_alchemist
```

���ò�����

- `--template-name`
- `--requirement`
- `--template-config '{}'`
- `--reference-file ./reference.png`
- `--reference-files ./ref2.png`�����ظ�
- `--hd-remove-bg-mode batch|single`
- `--output-dir ./outputs/hd_asset`

�Ѿ������� id ʱ��

```bash
python3 skills/meowart_api.py hd-gen-poll --api-job-id <api_job_id>
python3 skills/meowart_api.py hd-gen-download --api-job-id <api_job_id> --output-dir ./outputs/hd_download
```

## 6.1 ��ɫ����ͼ / Character Multi-View

����һ�Ž�ɫ�ο�ͼ������Ŀ��������ͬһ����ɫ�� 8 ��������ͼʱ��ʹ�� `character-multi-view-run`��
������ú�� `character_multi_view_generator` workflow����� 8 ��͸�� PNG ����ͼ��һ��������յ� 3x3 Ԥ��ͼ��

���ذ���ͼ��

```bash
python3 skills/meowart_api.py \
  character-multi-view-run \
  --reference-image ./hero_front.png \
  --mode pixel \
  --output-dir ./outputs/hero_8_direction
```

�������ͼ��

```bash
python3 skills/meowart_api.py \
  character-multi-view-run \
  --reference-image ./hero_front.png \
  --mode hd \
  --output-size 1024 \
  --output-dir ./outputs/hero_hd_8_direction
```

���ò�����

- `--reference-image ./hero.png` �� `--image-file ./hero.png`
- `--mode pixel|hd`
- `--canvas-resolution AUTO|1K|2K|4K`
- `--output-size 512`����ѡ��ָ��ÿ�ŷ���ͼ�����������γߴ硣
- `--temperature 0.0`

������`character-8-direction-run` �� `character-eight-direction-run` �ȼ��� `character-multi-view-run`��
����Ѿ������� id�������ã�

```bash
python3 skills/meowart_api.py character-multi-view-poll --api-job-id <api_job_id>
```

## 7. Remove Background

����ͼͨ���ã�

```bash
python3 skills/meowart_api.py \
  remove-background-run \
  --image-file ./pixel_image.png \
  --method pixel
```

����ͼʹ�ã�
```bash
python3 skills/meowart_api.py \
  remove-background-run \
  --image-file ./hd_image.png \
  --method hd
```



## 8. Pixelate

```bash
python3 skills/meowart_api.py \
  pixelate-run \
  --image-file ./input.png
```

��������ʺ��Ȱѽϴ�� AI ͼ�����ɸ��ɾ���С�ߴ�����ͼ���ټ�����ȥ�����ȴ����

## 9. Self-Loop Image Generation

```bash
python3 skills/meowart_api.py \
  self-loop-run \
  --image-file ./tile.png \
  --direction horizontal
```

`self-loop-run` Ĭ��ʹ�� `basic` ģʽ���ʺϵ������������򲹷졣�����Ҫ��������������ѭ��ͼ��ʹ�� `full` ģʽ��

```bash
python3 skills/meowart_api.py \
  self-loop-run \
  --image-file ./tile.png \
  --mode full
```

���ò����� `--image-file`��`--direction` �� `--mode`��������ᱳ��ͨ��ʹ�� `--direction horizontal`�����򳡾�ʹ�� `--direction vertical`������ƽ���ز�ʹ�� `--mode full`��

## 10. Texture Generator

���ɵ��ſ�ƽ�����������

```bash
python3 skills/meowart_api.py \
  texture-gen-run \
  --prompt "mossy cracked stone floor" \
  --texture-name "שǽ" \
  --texture-name "����Сʯ��" \
  --output-dir ./outputs/mossy_stone_texture
```

���ò�����

- `--prompt`����������
- `--texture-name`���ο������������ظ���Ҳ���Զ��ŷָ�����òο����� `ˮ��`��`�����ݵ��ҽ�`��`שǽ`��`ľ��`��`����Сʯ��`��`�����`��`�����е�����`��`��ɽ�Ҵ���������`��
- `--padding-mode no_padding|padded`
- `--edge-fill-pixels 1`
- `--no-self-loop`������Ĭ���ķ����������

## 11. Tileset Generator

���� dual-grid 15 terrain tileset��

```bash
python3 skills/meowart_api.py \
  tileset-gen-run \
  --prompt "lush grass foreground plus shallow blue water background" \
  --output-dir ./outputs/grass_water_tileset
```

��ѡʹ������������Ϊǰ���ͱ����ο���

```bash
python3 skills/meowart_api.py \
  tileset-gen-run \
  --prompt "mossy stone foreground plus lava background" \
  --foreground-texture ./stone_texture.png \
  --background-texture ./lava_texture.png \
  --texture-reference-mode white_region_fill \
  --output-dir ./outputs/stone_lava_tileset
```

���ò�����

- `--tileset-mode dual-grid-15`
- `--terrain-mode dual|single`
- `--foreground-color "#67B84F"` / `--background-color "#3D8EDB"`����ȷǰ��/��������ɫ��
- `--terrain-color "#67B84F"`��single ģʽ�ĵ����ξ�ȷ����ɫ��
- `--single-terrain-region foreground|background`��single ģʽ��������ǰ��������Χ����������һ��Ĭ���Ƴ���͸����
- `--single-terrain-remove-background` / `--no-single-terrain-remove-background`
- `--foreground-texture ./foreground.png`
- `--background-texture ./background.png`
- `--texture-reference-size 64`
- `--texture-reference-mode white_region_fill|texture_block_fill`

���ɡ�ֻ��ǰ��������͸������ tileset��

```bash
python3 skills/meowart_api.py \
  tileset-gen-run \
  --terrain-mode single \
  --single-terrain-region foreground \
  --foreground-color "#67B84F" \
  --prompt "simple grass edge" \
  --output-dir ./outputs/grass_transparent_tileset
```

���ɡ�ֻ�б�����ǰ��͸������ tileset��

```bash
python3 skills/meowart_api.py \
  tileset-gen-run \
  --terrain-mode single \
  --single-terrain-region background \
  --background-color "#3D8EDB" \
  --prompt "simple water edge" \
  --output-dir ./outputs/water_transparent_tileset
```

## 12. Map Presets And Isometric Map Generators

��ͼ����ǰ�������������� preset�����к���ͼƬʱֱ�����ظ��ã�

```bash
python3 skills/meowart_api.py \
  map-reference-search \
  --query "ocean water" \
  --workflow-id pixel_isometric_gen \
  --tile-size 1x1 \
  --limit 8
```

ֱ���������������

```bash
python3 skills/meowart_api.py \
  map-reference-search \
  --query "desert" \
  --workflow-id pixel_hex_isometric_gen \
  --download \
  --limit 6 \
  --output-dir ./outputs/desert_hex_presets
```

Ҳ���԰� preset id ���أ�

```bash
python3 skills/meowart_api.py \
  map-reference-download \
  --preset-id pixel-isometric-xxxxxxxxxxxxxxxx \
  --output-dir ./outputs/map_presets
```

û�к��� preset ʱ�������µĵȽǵ�ͼ�顣���صȽ�С�ؿ�ͨ����Ҫ���Ųο�ͼ��

```bash
python3 skills/meowart_api.py \
  isometric-gen-run \
  --prompt "two cozy forest RPG isometric pixel tiles with mossy stones" \
  --reference-image ./preset_01.png \
  --reference-image ./preset_02.png \
  --similar-tiles \
  --output-dir ./outputs/forest_isometric
```

�������ǵȽǵ�ͼ�飺

```bash
python3 skills/meowart_api.py \
  hex-isometric-gen-run \
  --prompt "two ocean hex isometric pixel tiles with coral and shallow water" \
  --reference-image ./hex_01.png \
  --reference-image ./hex_02.png \
  --similar-tiles \
  --output-dir ./outputs/ocean_hex
```

����Ƚǵ�ͼ�����ֱ���ú��ģ��ο�ͼ�����ģʽ�ɴ� 2 �� 4 �Ųο�ͼ��

```bash
python3 skills/meowart_api.py \
  hd-isometric-gen-run \
  --prompt "modern hospital block with clean roads and plaza" \
  --template modern \
  --mode standard \
  --similar-tiles \
  --output-dir ./outputs/modern_hd_isometric
```

�������ǵȽǵ�ͼ�飺

```bash
python3 skills/meowart_api.py \
  hd-hex-isometric-gen-run \
  --prompt "clean sci-fi hex platform with glowing edge lights" \
  --template clean_scifi \
  --mode standard \
  --similar-tiles \
  --output-dir ./outputs/scifi_hd_hex
```

���ò�����

- `map-reference-search --query "�ؼ���"`���������� preset���ؼ��ʿ��� `ocean`��`desert`��`grassland`��`modern`��`clay`��`hex` �ȡ�
- `--workflow-id pixel_isometric_gen|pixel_hex_isometric_gen|hd_isometric_gen|hd_hex_isometric_gen|tileset_gen`
- `--template-id ocean|desert|grassland|modern|clay|clean_scifi|...`
- `--tile-size 1x1|2x2|7-cell|tileset-template`
- `--asset-kind reference|template`
- `isometric-gen-run --mode standard|edit|tetraploid|road`
- `hex-isometric-gen-run --mode standard|edit|tetraploid|heptaploid`
- `hd-isometric-gen-run --mode standard|tetraploid|style_quad`
- `hd-hex-isometric-gen-run --mode standard|tetraploid`

## 13. Animate

```bash
python3 skills/meowart_api.py \
  animate-run \
  --image-file ./sprite.png \
  --prompt "slime bouncing" \
  --is-pixel \
  --output-format webp
```

Ĭ��ʾ��ֻչʾ���ط綯����`--output-format` ������ѡֵ�� `webp`��`gif` �� `spritesheet`��

- `webp`��Ĭ��ѡ��ʺϴ������ҳչʾ
- `gif`�������Ը�ֱ�ۣ��ʺϼ�Ԥ�������
- `spritesheet`���������֡ƴͼ���ʺϽ�����Ϸ�����п��Ʋ���

`animate-run` ���Զ��ύ����ѯ���������ɽ��������Ѿ������� id��Ҳ������ `animate-poll --api-job-id <id>` �����ȴ������ء�

## 13. Sound Effect Generator

���ɵ�������Ч��

```bash
python3 skills/meowart_api.py \
  sound-run \
  --prompt "soft wooden UI button click for cozy pixel RPG" \
  --duration 1 \
  --output-dir ./outputs/ui_click
```

����һ����Ч����

```bash
python3 skills/meowart_api.py \
  sound-run \
  --prompt "8-bit fantasy combat sound pack: sword slash, shield block, coin pickup, potion drink" \
  --sound-pack \
  --count 4 \
  --duration 1 \
  --output-dir ./outputs/combat_sfx_pack
```

���ò�����

- `--duration`��`0.5` �� `1` �� `10` ��������
- `--loop`�������ѭ�������
- `--sound-pack --count N`������ N ����ͬ��Ч��
- `--variants --count N`������ͬһ��Ч�� N ���汾��
- `--temperature`��ӳ�� ElevenLabs prompt influence����Χ 0 �� 1��
- `--no-normalize-volume`������Ĭ�Ϸ�ֵ��һ����
- `--provider-api-key`����ʱ�� ElevenLabs key������ʹ�ú�˻���������

�Ѿ������� id ʱ��

```bash
python3 skills/meowart_api.py sound-poll --api-job-id workflow-elevenlabs_generator-xxxx
```

## 14. Music Generator

ֻ���ɽṹ������ prompt����������Ƶ��

```bash
python3 skills/meowart_api.py \
  music-run \
  --prompt "A cozy pixel RPG village theme with flute, kalimba, soft strings, loop-friendly"
```

���� 30 �� demo ��Ƶ��

```bash
python3 skills/meowart_api.py \
  music-run \
  --prompt "A cozy pixel RPG village theme with flute, kalimba, soft strings, loop-friendly" \
  --audio-generate \
  --demo
```

��ѡ���ο�ͼ�����������ظ���

```bash
python3 skills/meowart_api.py \
  music-run \
  --prompt "Music inspired by this scene" \
  --reference-image ./scene.png
```

���ò�����

- `--prompt`����������������˲ο�ͼ������Ϊ�ա�
- `--reference-image`���ο�ͼƬ�����ظ���
- `--audio-generate`��ʵ������������Ƶ������ʱֻ��������������
- `--demo`����� `--audio-generate` ʹ�ã����ɵͳɱ� 30 ��������
- `--max-wait` / `--poll-interval`��������ѯ�ȴ���

`music-run` �ᱣ���ύ��Ӧ������ job ��Ӧ��������Ƶ���ɳɹ�ʱ���ط��������Ƶ�ļ����Ѿ��� job id ʱ�����ã�

```bash
python3 skills/meowart_api.py music-poll --api-job-id workflow-music_generator-xxxx
```

## 15. ���Ŀ¼

��Щ `*-run` ����Ĭ�ϻ��ڽű�Ŀ¼�´�����

```bash
./.meow_art/<timestamp>_<command>/
```

ͨ���ᱣ�棺

- `meta.json`
- `submit_response.json`
- `job_response.json`
- ���صõ��� PNG��GIF��WebP��spritesheet��MP3��WAV��OGG ������ļ�

�����Զ���Ŀ¼����ʹ�� `--work-dir` �� `--output-dir`����ϸ����Ϊ����ֱ�ӿ��ű�Դ�뼴�ɡ�

