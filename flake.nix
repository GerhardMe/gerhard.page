{
  description = "Astro project dev shell with Node + pnpm + emcc + Apache + PHP";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs =
    {
      self,
      nixpkgs,
      flake-utils,
      ...
    }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = import nixpkgs { inherit system; };
        php = pkgs.php.withExtensions ({ enabled, all }: enabled ++ [ all.gd ]);
      in
      {
        devShells.default = pkgs.mkShell {
          packages = with pkgs; [
            nodejs_20
            pnpm
            emscripten
            # Apache + PHP for backend
            apacheHttpd
            php
          ];

          shellHook = ''
            # Add local scripts to PATH
            export PATH="$PWD/scripts:$PATH"

            echo "🚀 Entered Astro dev shell"
            echo ""
            echo "Commands:"
            echo "  run          - Start both frontend + backend"
            echo "  run-frontend - Start Astro only (port 4321)"
            echo "  run-backend  - Start PHP only (port 3001)"
            echo ""
            echo "Node: $(node -v)"
            echo "pnpm: $(pnpm -v)"
            echo "emcc: $(command -v emcc || echo 'not found')"
            echo "PHP: $(php -v | head -1)"
            echo "Apache: $(httpd -v | head -1)"
          '';
        };
      }
    );
}
