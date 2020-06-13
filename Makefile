SWAGGER_FILES := $(wildcard openapi/*.json)

.PHONY: generate
generate:
	@for file in $(SWAGGER_FILES); do \
		VERSION=`echo $$file|sed -e 's/openapi\///' -e 's/.json//'`; \
		java -Xmx4G -jar openapi-generator-cli.jar \
		generate \
		-i $$file \
		-g typescript-fetch \
		-o ./src/$$VERSION -v; \
	done

.PHONY: fix_validation
fix_validation:
	node scripts/fixSwaggerV1.js


# generate-docker:
# 	docker run -v "${PWD}:/local" openapitools/openapi-generator-cli:latest \
# 	generate \
# 	-i /local/swagger-fixed.json \
# 	-g typescript-node \
# 	-o /local/out

download_jars:
	curl -o ./openapi-generator-cli.jar https://repo1.maven.org/maven2/org/openapitools/openapi-generator-cli/4.3.1/openapi-generator-cli-4.3.1.jar

download_swagger:
	mkdir openapi
	curl -o ./openapi/v1.json https://eaccountingapi.vismaonline.com/swagger/docs/v1
	curl -o ./openapi/v2.json https://eaccountingapi.vismaonline.com/swagger/docs/v2

all: download_swagger generate

.PHONY: download_swagger download_jars