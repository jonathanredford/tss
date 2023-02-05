nixpkgsSource:
let
  nixpkgs = import nixpkgsSource {};
in
with (nixpkgs); stdenv.mkDerivation rec {
  name = "env";

  env = buildEnv {
    name = name;
    paths = buildInputs;
  };

  buildInputs = [
    aws-vault
    entr
    fd
    jq
    niv
    nodejs-16_x
    ripgrep
    yarn
    terraform
  ] ++ lib.optionals stdenv.isLinux [
    glibcLocales
  ];
}
