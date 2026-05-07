#!/usr/bin/env bash
BASE_URL="${BASE_URL:-http://localhost:3001}"
set -euo pipefail

echo "---- typecheck ----"
npm run typecheck

echo ""
echo "---- build ----"
npm run build

echo ""
echo "---- git status ----"
git status

echo ""
echo "---- artifact status ----"
curl -s http://localhost:3001/artifacts/status | python3 -m json.tool || true

echo ""
echo "---- client contract validation ----"
curl -s http://localhost:3001/client-contract/mock-game-studio/validation | python3 -m json.tool || true

echo ""
echo "---- client implementation plan ----"
curl -s http://localhost:3001/client-contract/mock-game-studio/implementation-plan | python3 -m json.tool | head -n 50 || true

echo ""
echo "---- client requirements plan ----"
curl -s http://localhost:3001/client-requirements/mock-game-studio/plan | python3 -m json.tool | head -n 50 || true

echo ""
echo "---- client implementation readiness ----"
curl -s http://localhost:3001/client-contract/mock-game-studio/implementation-readiness | python3 -m json.tool || true

echo ""
echo "---- named artifact smoke check ----"
curl -s http://localhost:3001/artifacts/executionLedger | python3 -m json.tool | head -n 30 || true

echo ""
echo "---- artifact health ----"
curl -s http://localhost:3001/artifacts/health | python3 -m json.tool || true

echo ""
echo "---- artifact names ----"
curl -s http://localhost:3001/artifacts/names | python3 -m json.tool || true

echo ""
echo "---- artifact registry summary ----"
curl -s http://localhost:3001/artifacts/registry/summary | python3 -m json.tool || true

echo ""
echo "---- largest artifact ----"
curl -s http://localhost:3001/artifacts/largest | python3 -m json.tool || true

echo ""
echo "---- artifact size map ----"
curl -s http://localhost:3001/artifacts/size-map | python3 -m json.tool || true

echo ""
echo "---- artifact readiness ----"
curl -s http://localhost:3001/artifacts/readiness | python3 -m json.tool || true

echo ""
echo "---- artifact data types ----"
curl -s http://localhost:3001/artifacts/data-types | python3 -m json.tool || true

echo ""
echo "---- artifact manifest ----"
curl -s http://localhost:3001/artifacts/manifest | python3 -m json.tool | head -n 40 || true

echo ""
echo "---- artifact registry version ----"
curl -s http://localhost:3001/artifacts/registry-version | python3 -m json.tool || true

echo ""
echo "---- recent commits ----"
git log --oneline -12

echo ""
echo "---- package scripts ----"
npm run


echo "\n---- client onboarding questionnaire ----"
curl -s "$BASE_URL/client/onboarding-questionnaire" | python3 -m json.tool | head -80

echo "\n---- client field coverage ----"
curl -s "$BASE_URL/client/field-coverage" | python3 -m json.tool | head -80

echo "\n---- client data request packet ----"
curl -s "$BASE_URL/client/data-request-packet" | python3 -m json.tool | head -80

echo "\n---- client governance brief ----"
curl -s "$BASE_URL/client/governance-brief" | python3 -m json.tool | head -80

echo "\n---- client implementation readiness ----"
curl -s "$BASE_URL/client/implementation-readiness" | python3 -m json.tool | head -100



echo
echo "---- client adapter blueprint ----"
curl -s "$BASE_URL/client/adapter-blueprint" | python3 -m json.tool | head -80

echo
echo "---- client output delivery plan ----"
curl -s "$BASE_URL/client/output-delivery-plan" | python3 -m json.tool | head -80

echo
echo "---- client deployment checklist ----"
curl -s "$BASE_URL/client/deployment-checklist" | python3 -m json.tool | head -80

echo
echo "---- client build package ----"
curl -s "$BASE_URL/client/build-package" | python3 -m json.tool | head -100



echo
echo "---- client acceptance criteria ----"
curl -s "$BASE_URL/client/acceptance-criteria" | python3 -m json.tool | head -80

echo
echo "---- client test scenarios ----"
curl -s "$BASE_URL/client/test-scenarios" | python3 -m json.tool | head -80

echo
echo "---- client demo script ----"
curl -s "$BASE_URL/client/demo-script" | python3 -m json.tool | head -80

echo
echo "---- client acceptance package ----"
curl -s "$BASE_URL/client/acceptance-package" | python3 -m json.tool | head -100



echo
echo "---- client pilot scope ----"
curl -s "$BASE_URL/client/pilot-scope" | python3 -m json.tool | head -80

echo
echo "---- client pilot risk register ----"
curl -s "$BASE_URL/client/pilot-risk-register" | python3 -m json.tool | head -80

echo
echo "---- client pilot success metrics ----"
curl -s "$BASE_URL/client/pilot-success-metrics" | python3 -m json.tool | head -80

echo
echo "---- client pilot plan ----"
curl -s "$BASE_URL/client/pilot-plan" | python3 -m json.tool | head -100



echo
echo "---- client production prerequisites ----"
curl -s "$BASE_URL/client/production-prerequisites" | python3 -m json.tool | head -80

echo
echo "---- client production risk report ----"
curl -s "$BASE_URL/client/production-risk-report" | python3 -m json.tool | head -80

echo
echo "---- client production handoff plan ----"
curl -s "$BASE_URL/client/production-handoff-plan" | python3 -m json.tool | head -100

echo
echo "---- client production demo script ----"
curl -s "$BASE_URL/client/production-demo-script" | python3 -m json.tool | head -80

echo
echo "---- client production handoff package ----"
curl -s "$BASE_URL/client/production-handoff-package" | python3 -m json.tool | head -100



echo
echo "---- client go-live checklist ----"
curl -s "$BASE_URL/client/go-live-checklist" | python3 -m json.tool | head -80

echo
echo "---- client go-live risk report ----"
curl -s "$BASE_URL/client/go-live-risk-report" | python3 -m json.tool | head -80

echo
echo "---- client go-live decision ----"
curl -s "$BASE_URL/client/go-live-decision" | python3 -m json.tool | head -100

echo
echo "---- client launch brief ----"
curl -s "$BASE_URL/client/launch-brief" | python3 -m json.tool | head -80

echo
echo "---- client go-live package ----"
curl -s "$BASE_URL/client/go-live-package" | python3 -m json.tool | head -100



echo
echo "---- client commercial value hypothesis ----"
curl -s "$BASE_URL/client/commercial-value-hypothesis" | python3 -m json.tool | head -80

echo
echo "---- client roi model ----"
curl -s "$BASE_URL/client/roi-model" | python3 -m json.tool | head -80

echo
echo "---- client commercial readiness score ----"
curl -s "$BASE_URL/client/commercial-readiness-score" | python3 -m json.tool | head -80

echo
echo "---- client buyer brief ----"
curl -s "$BASE_URL/client/buyer-brief" | python3 -m json.tool | head -80

echo
echo "---- client objection handling ----"
curl -s "$BASE_URL/client/objection-handling" | python3 -m json.tool | head -80

echo
echo "---- client commercial package ----"
curl -s "$BASE_URL/client/commercial-package" | python3 -m json.tool | head -100



echo
echo "---- client commercial summary ----"
curl -s "$BASE_URL/client/commercial-summary" | python3 -m json.tool | head -80

