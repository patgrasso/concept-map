
import wikipedia
import sys
import os
import subprocess

from semnet.network import SemNet
from semnet.store import PickleStore
from semnet import parser, config, interp

if len(sys.argv) <= 1:
    sys.argv += ["tree"]

pages = ' '.join(sys.argv[1:]).split(',')

try:
    mind = PickleStore.load("semnet.pickle")
except:
    mind = SemNet()

store = PickleStore(mind, "semnet.pickle")

for page in pages:
    wikipedia.set_lang("simple")
    page = wikipedia.page(page)

    content = page.content.split('.')
    content = [sent.lower().strip() for sent in content]
    content = [''.join([i if ord(i) < 128 else '' for i in sent])
               for sent in content]

    result = parser.raw_parse_sents(content)

    prev_subj = None
    for parsed_sent in result:
        dep_graph = next(parsed_sent)
        try:
            prev_subj = interp.eval_root(
                dep_graph.root,
                dep_graph.nodes,
                mind,
                prev_subj)
        except:
            pass


output_fname = os.path.join(
    config.get("graphs", "output-dir"),
    os.path.basename(page.url))

mind.to_dot(output_fname + ".dot")

subprocess.call(["dot",
                 "-Tpng", output_fname + ".dot",
                 "-o", output_fname + ".png"])

#sandbox.show_concept()
#sandbox.repl()


