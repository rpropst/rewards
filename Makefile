SENTRY_ORG=testorg-az
SENTRY_PROJECT=r2r-express
RELEASE=2021.4.6


setup_release: create_release associate_commits

create_release:
	sentry-cli releases -o $(SENTRY_ORG) new -p $(SENTRY_PROJECT) $(RELEASE)

associate_commits:
	sentry-cli releases -o $(SENTRY_ORG) -p $(SENTRY_PROJECT) set-commits --auto $(RELEASE)

upload_sourcemaps:
	sentry-cli releases -o $(SENTRY_ORG) -p $(SENTRY_PROJECT) files $(RELEASE) \
		upload-sourcemaps --url-prefix "~/$(PREFIX)" --validate build/$(PREFIX)
