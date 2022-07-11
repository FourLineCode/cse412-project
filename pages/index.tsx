export default function Home() {
  return null;
}

export function getServerSideProps() {
  return {
    props: {},
    redirect: {
      destination: "/signin",
      permanent: false,
    },
  };
}
