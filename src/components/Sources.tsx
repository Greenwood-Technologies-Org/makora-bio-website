const Sources = () => {
  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto fade-in-section">
          <h4 className="text-sm font-semibold text-foreground mb-3">Sources</h4>
          <div className="space-y-2 text-xs text-muted-foreground">
            <p>
              1. Makora Bio (2025). Clinical Operations Interviews. Internal report
            </p>
            <p>
              2. Montano et al. (2021). J. Soc. Clin. Data Manage. 4.{" "}
              <a
                href="https://doi.org/10.47912/jscdm.31"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                https://doi.org/10.47912/jscdm.31
              </a>
            </p>
            <p>
              3. Advarra (2025). 2024 Site-Sponsor-CRO Collaboration Survey Report.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Sources;
