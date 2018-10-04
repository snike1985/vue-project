<template>

  <!--content-->
  <div class="content">

    <!--content__layout-->
    <div class="content__layout">

      <!--content__centered-->
      <div class="content__centered">

        <h1>Terms of Service</h1>

        <div>

          <h4>Effective: May 05, 2018</h4>

          <p>
            These Terms of Service govern your access and use of services provided to the User (the Company) via
            our websites, applications, APIs, emails, and any Content downloaded via our websites.
          </p>

        </div>

        <!--content__inner-->
        <div class="content__inner">

          <div>

            <h4>Use of the Terms of Service (Agreement)</h4>

            <p>
              The Jurnez is web-based and mobile-based digital system to manage crew change process, owned and
              operated by Shipcosts AS, the company registered in Norway, registration number 920161634.
            </p>

            <p>
              By clicking “I accept” you agree to be bound by the Agreement and you agree to comply with these
              Terms of Service. If you are accepting these Terms of Service on behalf of the Company, (corporation,
              limited liability company, partnership of any other legal entity) you warrant that you authorized to do
              so.
            </p>

            <p>
              This Agreement shall be governed by and construed exclusively in accordance with the laws of Norway,
              without regard to principles of conflicts of law. Any disputes arising under or in connection with the
              Agreement or the use of information, material and services available on or through the Platform,
              whether in contract or in tort, shall be subject to the exclusive jurisdiction of the courts of Norway.
            </p>

          </div>

          <div>

            <h4>Mobile applications</h4>

            <p>
              The traveling crew who is given access to mobile application of Jurnez, will be provided with the terms
              of use and privacy policy via mobile application.
            </p>

          </div>

          <div>

            <h4>Privacy</h4>

            <p>
              Our Privacy Policy is available at our website <a target="_blank" href="https://jurnez.com/">www.jurnez.com</a>
            </p>

          </div>

          <div>

            <h4>Copyright Statement</h4>

            <p>
              Jurnez is subject to Shipcosts AS copyright and all rights reserved. No part of the system may be
              reproduced, transmitted or copied in any form or by any means, including uploading on the internet,
              without the prior written consent of Shipcosts AS.
            </p>

          </div>

          <div>

            <h4>Availability of products, apps, services, information and materials</h4>

            <p>
              Unless otherwise agreed in connection with a specific product, app or service, Shipcosts AS may change,
              update or remove the products, services, apps, information and material that it has made available on
              or through the system without notice.
            </p>

          </div>

          <div>

            <h4>Cloud based or hosted products, apps and services</h4>

            <p>
              We may use services from reputable service providers for the purpose of cloud based or hosted
              products, apps and services. All hosted or cloud-based products, apps and services will be subject to
              the service levels and terms of the relevant provider.
            </p>

            <p>
              The relevant terms and service levels will be deemed to be implemented or reflected in all product,
              service and app agreements unless otherwise informed.
            </p>

          </div>

          <div>

            <h4>Confidentiality</h4>

            <p>
              Both parties agree to use reasonable endeavours to avoid disclosure of Confidential Information
              obtained from the other party.
            </p>

            <p>
              Confidential information (<strong>“Confidential Information”</strong>) means any and all information disclosed
              verbally, electronically, visually, or in a written or other tangible form which is either identified or should
              be reasonably understood by the recipient party to be confidential or proprietary to the other party.
              Confidential Information includes, but is not limited to, trade secrets, computer programs, software,
              formulas, data, inventions, techniques, documentation, marketing plans, strategies, forecasts and third
              party confidential information.
            </p>

            <p>
              However, each party shall be free to disclose such information as is:
            </p>

            <ul>

              <li>
                known prior to the information being disclosed by the other party;
              </li>

              <li>
                part of the public domain at the time of disclosure, or;
              </li>

              <li>
                required to be disclosed by public authorities in accordance with applicable law.
              </li>

            </ul>

            <p>
              The Company confirms that Shipcosts AS shall hold a right to use and process any information
              generated or collected under or in connection with this Agreement, including in connection with any
              product, app or service accessed or used by Company, in an anonymized and aggregated form. More
              information on use of personal data is available in our Privacy Policy.
            </p>

          </div>

          <div>

            <h4>Log-in information</h4>

            <p>
              The Company shall keep all user names and passwords provided for use on or in connection with the
              Jurnez system confidential, and not distribute them further within or outside of user’s organization. The
              Company may, at its discretion, to provide the credentials to login the system, to the third party such
              as port agent, manning agent or travel provider. In this case, the Company is responsible for maintaining
              the confidentiality of the registration information, including user ID and password and for any and all
              activity that occurs on the account.
            </p>

            <p>
              The Company will immediately notify Shipcosts AS of any unauthorized use of the user ID and/or
              password and that you did not allow any third party to use your account.
            </p>

          </div>

          <div>

            <h4>Responsibilities</h4>

            <p>
              Shipcosts AS has no liability or responsibility for direct, indirect or any other loss or damage, whether in
              contract or in tort (including negligence), arising as a consequence of using the Services.
            </p>

          </div>

          <div>

            <h4>Company administrator rights</h4>

            <p>
              The Jurnez’s administrator has access to the Companies account via SuperAdmin, where we may create
              and delete individual user accounts for the Users.
            </p>

            <p>
              SuperAdmin is responsible for keeping track on all user accounts and for all use by the Company’s users.
            </p>

            <p>
              In no case Shipcosts AS will disclose the information about the Company’ users or traveling crews, other
              than stipulated by the law.
            </p>

          </div>

        </div>
        <!--/content__inner-->

        <accepted :type="'terms'"/>

      </div>
      <!--/content__centered-->

    </div>
    <!--/content__layout-->

  </div>
  <!--/content-->

</template>

<script>
  import {mapState} from 'vuex'
  import Accepted from "../components/accepted";

  export default {
    components: {Accepted},
    computed: mapState(['']),
    name: "terms",
    head() {
      return {
        title: 'Terms of use'
      }
    },
    data() {
      return {
        form: {
          accepted: false,
          changed: false
        }
      }
    },
    methods: {
      openAcceptedTermsModal() {
        this.$store.dispatch('acceptedTermsModal', {open: true})
      },
      changeAccepted() {
        this.form.changed = true
      },
      onSubmit(e) {
        e.preventDefault();

        if (this.form.accepted) {
          this.openAcceptedTermsModal();
        }
      }
    }
  }
</script>

<style lang="scss">
  @import '../assets/scss/content';
</style>
